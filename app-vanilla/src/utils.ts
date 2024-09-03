export function assertIsError(error: unknown): asserts error is Error {
	if (!(error instanceof Error)) {
		throw error;
	}
}

export function isFunction(value: unknown): value is Function {
	return typeof value === 'function';
}
