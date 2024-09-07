export function assertIsError(error: unknown): asserts error is Error {
	if (!(error instanceof Error)) {
		throw error;
	}
}

export function extendError(error: Error, messageOrError: string | Error) {
	if (messageOrError instanceof Error) {
		error.name = `\n${messageOrError.name}/${error.name}`;
		error.message = `\n${messageOrError.message}\n${error.message}`;
	} else {
		error.message = `\n${messageOrError}\n${error.message}`;
	}

	return error;
}

export function createError(name: string, message: string) {
	const error = new Error(message);
	error.name = name;

	if (Error.captureStackTrace) {
		Error.captureStackTrace(error, createError);
	}

	if (process.env.NODE_ENV === 'development') {
		error.stack = error.stack.replace(/\/\./g, '');
		error.stack = error.stack.replace(/\?/g, '');
	}

	return error;
}

export function isFunction(value: unknown): value is Function {
	return typeof value === 'function';
}
