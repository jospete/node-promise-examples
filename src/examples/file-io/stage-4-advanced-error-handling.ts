import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { createInterface } from 'readline';

import { makeOutputContent } from './file-io-util';

const rl = createInterface({
	input: process.stdin,
	output: process.stdout
});

/**
 * Declare what kinds of errors can happen within the run() scope
 */
export enum ErrorContextCode {
	FIRST_FILE_NOT_GIVEN = 'FIRST_FILE_NOT_GIVEN',
	FIRST_FILE_NOT_FOUND = 'FIRST_FILE_NOT_FOUND',
	FIRST_FILE_READ_ERROR = 'FIRST_FILE_READ_ERROR',
	SECOND_FILE_NOT_GIVEN = 'SECOND_FILE_NOT_GIVEN',
	SECOND_FILE_NOT_FOUND = 'SECOND_FILE_NOT_FOUND',
	SECOND_FILE_READ_ERROR = 'SECOND_FILE_READ_ERROR',
	OUTPUT_FILE_NOT_GIVEN = 'OUTPUT_FILE_NOT_GIVEN',
	OUTPUT_FILE_WRITE_ERROR = 'OUTPUT_FILE_WRITE_ERROR'
}

/**
 * Catches and tags an error with a "code" context so we know where the error came from.
 */
export const rejectWith = <T>(promise: Promise<T>, code: any): Promise<T> => {
	return Promise.resolve(promise).catch(error => Promise.reject({ error, code }));
};

/**
 * Like assert() but with promises.
 */
export const assertPromise = (condition: boolean, error?: any): Promise<void> => {
	return condition ? Promise.resolve() : Promise.reject(error);
};

const ask = (question: string): Promise<string> => {

	return new Promise((resolve, reject) => {

		const closeEvent = 'close';
		const closedListener = () => {
			console.log(`question "${question}" got interrupted by close!`);
			reject(closeEvent);
		};

		rl.question(question, (result: string) => {
			rl.removeListener(closeEvent, closedListener);
			resolve(result);
		});

		rl.once(closeEvent, closedListener);
	});
};

/**
 * Read terminal input to get a path to a file,
 * AND assert that the file exists.
 */
const loadFilePathFromInput = async (
	question: string,
	notGivenError: ErrorContextCode,
	notFoundError: ErrorContextCode
): Promise<string> => {
	const result = await rejectWith(ask(question), notGivenError);
	await rejectWith(assertPromise(existsSync(result)), notFoundError);
	return result;
};

/**
 * Now gives context at each step when errors happen.
 * Don't worry about an error happening within the operation chain.
 * Instead, make it the caller's responsibility to diagnose errors.
 */
const run = async (): Promise<any> => {

	const inputPath1 = await loadFilePathFromInput(
		'enter first file name: ',
		ErrorContextCode.FIRST_FILE_NOT_GIVEN,
		ErrorContextCode.FIRST_FILE_NOT_FOUND
	);

	const inputPath2 = await loadFilePathFromInput(
		'enter second file name: ',
		ErrorContextCode.SECOND_FILE_NOT_GIVEN,
		ErrorContextCode.SECOND_FILE_NOT_FOUND
	);

	const outputPath = await rejectWith(
		ask('enter output file name: '),
		ErrorContextCode.OUTPUT_FILE_NOT_GIVEN
	);

	const input1 = await rejectWith(
		readFile(inputPath1, 'utf8'),
		ErrorContextCode.FIRST_FILE_READ_ERROR
	);

	const input2 = await rejectWith(
		readFile(inputPath2, 'utf8'),
		ErrorContextCode.SECOND_FILE_READ_ERROR
	);

	const output = makeOutputContent(input1, input2);

	await rejectWith(
		writeFile(outputPath, output, 'utf8'),
		ErrorContextCode.OUTPUT_FILE_WRITE_ERROR
	);
};

run()
	.then(() => {
		console.log('process finished!');
		process.exit(0);
	})
	.catch(e => {

		console.warn('process error! -> ', e);
		const { code } = e;

		switch (code) {
			case ErrorContextCode.FIRST_FILE_NOT_FOUND:
			case ErrorContextCode.FIRST_FILE_NOT_GIVEN:
			case ErrorContextCode.FIRST_FILE_READ_ERROR:
				console.log('error happened on the first file');
				break;
			default:
				console.log('unhandled code: ' + code);
				break;
		}

		process.exit(1);
	});