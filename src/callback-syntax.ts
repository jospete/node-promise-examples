const random = (max: number): number => Math.floor(Math.random() * max);

/**
 * Add two values, pass the result back to the given callback.
 */
const addValues = (a: number, b: number, callback: (value: number) => void): void => {
	callback(a + b);
};

/**
 * Generate two random values, calculate a result and send the result to the given callback.
 */
const addRandom = (callback: (output: string) => void) => {

	const a = random(100);
	const b = random(100);

	const addValuesCallback = (result: number) => {
		callback(`${a} + ${b} = ${result}`);
	};

	addValues(a, b, addValuesCallback);
};

const addRandomCallback = (output: string) => console.log(output);
addRandom(addRandomCallback);