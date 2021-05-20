/**
 * Also known as... sleep!
 */
const setTimeoutAsPromise = (durationMs: number): Promise<void> => {

	/**
	 * The Promise constructor takes a "resolver" function, which is passed resolve and reject functions.
	 * Either resolve OR reject (but not both!) should be called when the async operation completes.
	 * 
	 * setTimeout() will always succeed, so we skip the reject portion for this example.
	 */
	return new Promise((resolve) => {

		setTimeout(resolve, durationMs);
	});
};

/**
 * Generic implementation for converting a NodeJS callback to a promise.
 * Example conversion of setTimeout() -> promisify(callback => setTimeout(callback, 500))
 */
const promisify = <T>(action: (callback: (error: any, result: T) => void) => void): Promise<T> => {

	return new Promise((resolve, reject) => {

		/**
		 * A generalized NodeJS callback mechanism.
		 * This is where we wash away "callback boilerplate" and leave it up to the Promise implementation instead.
		 */
		const cb = (err: any, res: T) => {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		};

		/**
		 * Invoke the original action, and give it a callback to use.
		 */
		action(cb);
	});
};

const logDuration = (startTimestamp: number): void => {
	console.log(`${Date.now() - startTimestamp} ms have passed`);
};

const run = (): Promise<any> => {

	const start = Date.now();

	// This behavior....
	return setTimeoutAsPromise(1000)
		.then(() => {
			logDuration(start);
			// ... is the exact same as this
			return promisify(callback => setTimeout(callback, 1000));
		})
		.then(() => {
			logDuration(start);
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