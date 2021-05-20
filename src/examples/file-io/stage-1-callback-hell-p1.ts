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
 * Brain-dead approach - check for error at each step, otherwise make next call in sequence.
 * This is hard to read, and REALLY hard to maintain as logic complexity grows.
 * 
 * Continue to stage-1-callback-hell-p2.ts
 */
const run = (callback: (error: any) => void): void => {

	ask('enter first file name: ', (firstError, inputPath1) => {
		if (firstError) return callback(firstError);

		ask('enter second file name: ', (secondError, inputPath2) => {
			if (secondError) return callback(firstError);

			ask('enter output file name: ', (thirdError, outputPath) => {
				if (thirdError) return callback(thirdError);

				readFile(inputPath1!, 'utf8', (fourthError, input1) => {
					if (fourthError) return callback(fourthError);

					readFile(inputPath2!, 'utf8', (fifthError, input2) => {
						if (fifthError) return callback(fifthError);

						const output = makeOutputContent(input1, input2);

						writeFile(outputPath!, output, 'utf8', sixthError => {
							if (sixthError) return callback(sixthError);
							callback(null);
						});
					});
				});
			});
		});
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