import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { createInterface } from 'readline';

import { assertPromise, rejectWith, ErrorContextCode, makeOutputContent } from './file-io-util';

const rl = createInterface({
	input: process.stdin,
	output: process.stdout
});

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

const loadFilePathFromInput = async (
	question: string,
	notGivenError: ErrorContextCode,
	notFoundError: ErrorContextCode
): Promise<string> => {
	const result = await rejectWith(ask(question), notGivenError);
	await rejectWith(assertPromise(existsSync(result)), notFoundError);
	return result;
};

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
		ErrorContextCode.SECOND_FILE_READ_ERROR
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
		}

		process.exit(1);
	});