import { ExecutorAdapterType, ExecutorFor, FetchAdapterFor, LoaderAdapterType, ScriptContent } from './types';
import { EvalExecutorAdapter } from './executors/EvalExecutorAdapter';
import { AxiosLoadAdapter } from './loaders/AxiosLoadAdapter';
import { FetchLoadAdapter } from './loaders/FetchLoadAdapter';
import { BlobImportExecutorAdapter } from './executors/BlobImportExecutorAdapter';
import { FunctionExecutorAdapter } from './executors/FunctionExecutorAdapter';
import { InlineDataExecutorAdapter } from './executors/InlineDataExecutorAdapter';

export function createScriptContent(content: string) {
	if (content.trim().length === 0) {
		throw new Error('Script content cannot be empty');
	}
	return content as ScriptContent;
}

export function createExecutor<T extends ExecutorAdapterType>(type: T): ExecutorFor<T> {
	switch (type) {
		case 'blob':
			return new BlobImportExecutorAdapter() as ExecutorFor<T>;
		case 'eval':
			return new EvalExecutorAdapter() as ExecutorFor<T>;
		case 'function':
			return new FunctionExecutorAdapter() as ExecutorFor<T>;
		case 'inlineData':
			return new InlineDataExecutorAdapter() as ExecutorFor<T>;
		default:
			throw new Error(`Unsupported executor type: ${type}`);
	}
}

export function createLoader<T extends LoaderAdapterType>(type: T): FetchAdapterFor<T> {
	switch (type) {
		case 'fetch':
			return new FetchLoadAdapter() as FetchAdapterFor<T>;
		case 'axios':
			return new AxiosLoadAdapter() as FetchAdapterFor<T>;
		default:
			throw new Error(`Unsupported fetch adapter type: ${type}`);
	}
}
