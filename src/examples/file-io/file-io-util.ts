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

export const rejectWith = <T>(promise: Promise<T>, code: any): Promise<T> => {
	return Promise.resolve(promise).catch(error => Promise.reject({ error, code }));
};

export const assertPromise = (condition: boolean, error?: any): Promise<void> => {
	return condition ? Promise.resolve() : Promise.reject(error);
};

export const makeOutputContent = (input1: string, input2: string): string => `input 1:
-------------------
${input1}

input 2:
-------------------
${input2}`;