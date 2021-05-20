import { readFile, writeFile } from 'fs';
import { createInterface } from 'readline';

import { makeOutputContent } from './file-io-util';

const rl = createInterface({
	input: process.stdin,
	output: process.stdout
});

const ask = (question: string, callback: (error: any, result: string | undefined) => void): void => {

	rl.question(question, (result: string) => {
		callback(null, result);
	});

	rl.on('close', () => {
		console.log(`question "${question}" got interrupted by close!`);
		callback('close', undefined);
	});
};

/**
 * Can we just save the values in the upper scope?
 * This would flatten our logic to a list-like structure, which is much easier to read and maintain.
 */
const run = (callback: (error: any) => void): void => {

	let inputPath1: string;
	let inputPath2: string;
	let outputPath: string;
	let input1: string;
	let input2: string;

	ask('enter first file name: ', (e, ip1) => {
		if (e) return callback(e);
		inputPath1 = ip1!;
	});

	ask('enter second file name: ', (e, ip2) => {
		if (e) return callback(e);
		inputPath2 = ip2!;
	});

	ask('enter output file name: ', (e, op) => {
		if (e) return callback(e);
		outputPath = op!;
	});

	readFile(inputPath1!, 'utf8', (e, i1) => {
		if (e) return callback(e);
		input1 = i1!;
	});

	readFile(inputPath2!, 'utf8', (e, i2) => {
		if (e) return callback(e);
		input2 = i2!;
	});

	const output = makeOutputContent(input1!, input2!);

	writeFile(outputPath!, output, 'utf8', sixthError => {
		if (sixthError) return callback(sixthError);
		callback(null);
	});
};

run((error) => {
	if (error) {
		console.warn('process error! -> ', error);
		process.exit(1);

	} else {
		console.log('process finished!');
		process.exit(0);
	}
});