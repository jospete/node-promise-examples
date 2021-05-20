import { readFile, writeFile } from 'fs/promises';
import { createInterface } from 'readline';

import { makeOutputContent } from './file-io-util';

const rl = createInterface({
	input: process.stdin,
	output: process.stdout
});

const ask = (question: string): Promise<string> => {
	return new Promise((resolve, reject) => {

		rl.question(question, (result: string) => {
			resolve(result);
		});

		rl.on('close', () => {
			console.log(`question "${question}" got interrupted by close!`);
			reject('close');
		});
	});
};

/**
 * Promises give us the flat list-like structure we want, and handle error checking for us.
 */
const run = (): Promise<any> => {

	let inputPath1: string;
	let inputPath2: string;
	let outputPath: string;
	let input1: string;
	let input2: string;

	return ask('enter first file name: ')
		.then(ip1 => {
			inputPath1 = ip1;
			return ask('enter second file name: ');
		})
		.then(ip2 => {
			inputPath2 = ip2;
			return ask('enter output file name: ');
		})
		.then(op => {
			outputPath = op;
			return readFile(inputPath1, 'utf8');
		})
		.then(i1 => {
			input1 = i1;
			return readFile(inputPath2, 'utf8');
		})
		.then(i2 => {
			input2 = i2;
			const output = makeOutputContent(input1, input2);
			return writeFile(outputPath, output, 'utf8');
		});
};

run()
	.then(() => {
		console.log('process finished!');
		process.exit(0);
	})
	.catch(e => {
		console.warn('process error! -> ', e);
		process.exit(1);
	});