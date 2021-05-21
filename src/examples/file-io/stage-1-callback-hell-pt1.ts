import { readFile, writeFile } from 'fs';
import { createInterface } from 'readline';

import { makeOutputContent } from './file-io-util';

const rl = createInterface({
	input: process.stdin,
	output: process.stdout
});

/**
 * Prompt the terminal with a question, 
 * intercept input and hand it off to "callback".
 */
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
 * Naive approach, AKA "what is async?"
 */
const run = (callback: (error: any) => void): void => {

	let inputPath1: string;
	let inputPath2: string;
	let outputPath: string;
	let input1: string;
	let input2: string;

	ask('enter first file name: ', (e, v) => {
		console.log('first file name cb: ', e, v);
		if (e) return callback(e);
		inputPath1 = v!;
	});

	ask('enter second file name: ', (e, v) => {
		console.log('second file name cb: ', e, v);
		if (e) return callback(e);
		inputPath2 = v!;
	});

	ask('enter output file name: ', (e, v) => {
		console.log('output file name cb: ', e, v);
		if (e) return callback(e);
		outputPath = v!;
	});

	readFile(inputPath1!, 'utf8', (e, v) => {
		console.log('first file read cb: ', e, v);
		if (e) return callback(e);
		input1 = v!;
	});

	readFile(inputPath2!, 'utf8', (e, v) => {
		console.log('second file read cb: ', e, v);
		if (e) return callback(e);
		input2 = v!;
	});

	const output = makeOutputContent(input1!, input2!);

	writeFile(outputPath!, output, 'utf8', e => {
		console.log('output file write cb: ', e);
		if (e) return callback(e);
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