/**
 * Function for exhaustiveness checks.
 * Will cause compiler error, if given value is not never;
 * @param value value that should not exist
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function checkExhaustiveness(value: never): never {
    throw new Error('Never should reach here');
}

// some aliases for better readability
export const assertUnreachable = checkExhaustiveness;
export const assertAllCasesHandled = checkExhaustiveness;
