/**
 * Background operation to give the other functions some common work.
 * 
 */
const parseIntSafe = (value: any, radix: number = 10, defaultValue: number = 0): number => {
	if (typeof value === 'number') return value;
	const parsed = parseInt(value, radix);
	return (!isNaN(parsed) && (typeof parsed === 'number')) ? parsed : defaultValue;
};

/**
 * Vanilla "old school" javascript function - declaration syntax:
 * function <<functionName>> ( <<...parameters>> ) { <<functionBody>> }
 */
function vanillaJsFunc(param1: string, param2: number): number {
	return parseIntSafe(param1) + param2;
}

/**
 * Explicit arrow function - declaration syntax:
 * const <<functionName>> = ( <<...parameters>> ) => { <<functionBody>> }; // <- note the semicolon since we are declaring with CONST
 */
const explicitArrowJsFunc = (param1: string, param2: number): number => {
	return parseIntSafe(param1) + param2;
};

/**
 * Inline/implicit arrow function - declaration syntax:
 * const <<functionName>> = ( <<...parameters>> ) => <<valueExpression>>; // <- note the semicolon since we are declaring with CONST
 */
const implicitArrowJsFunc = (param1: string, param2: number) => parseIntSafe(param1) + param2;

// All of them do the same thing
console.log(vanillaJsFunc('2', 3)); // 5
console.log(explicitArrowJsFunc('2', 3)); // 5
console.log(implicitArrowJsFunc('2', 3)); // 5