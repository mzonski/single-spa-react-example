import { assertIsError, isFunction } from '../../utils';

export async function withErrorHandling<T>(operation: (() => Promise<T>) | Promise<T>, errorMessage: string) {
	try {
		return await (isFunction(operation) ? operation() : operation);
	} catch (error) {
		assertIsError(error);
		throw new Error(`${errorMessage}: ${error.message}`);
	}
}
