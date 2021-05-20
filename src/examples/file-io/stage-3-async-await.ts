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

const run = async (): Promise<any> => {

	const inputPath1 = await ask('enter first file name: ');
	const inputPath2 = await ask('enter second file name: ');
	const outputPath = await ask('enter output file name: ');

	const input1 = await readFile(inputPath1, 'utf8');
	const input2 = await readFile(inputPath2, 'utf8');
	const output = makeOutputContent(input1, input2);

	await writeFile(outputPath, output, 'utf8');
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