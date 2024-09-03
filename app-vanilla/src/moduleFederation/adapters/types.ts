import { EvalExecutorAdapter } from './executors/EvalExecutorAdapter';
import { FetchLoadAdapter } from './loaders/FetchLoadAdapter';
import { AxiosLoadAdapter } from './loaders/AxiosLoadAdapter';
import { Brand } from '../../utilityTypes';
import { WebpackModuleFederationRuntime } from '../webpackTypes';
import { FunctionExecutorAdapter } from './executors/FunctionExecutorAdapter';
import { BlobImportExecutorAdapter } from './executors/BlobImportExecutorAdapter';

export type ScriptContent = Brand<string, 'ScriptContent'>;

type ExecutorSuccessResult<T> = {
	success: true;
	module: T;
};
type ExecutorErrorResult = {
	success: false;
	error: Error;
};

export type ExecutorResult<T> = ExecutorSuccessResult<T> | ExecutorErrorResult;

export function isExecutorFailed(result: ExecutorResult<unknown>): result is ExecutorErrorResult {
	return result.success === false;
}

export type ExecutorAdapterType = 'blob' | 'eval' | 'function';

export type ExecutorFor<T extends ExecutorAdapterType> =
	T extends 'blob' ? BlobImportExecutorAdapter
	: T extends 'eval' ? EvalExecutorAdapter
	: T extends 'function' ? FunctionExecutorAdapter
	: never;

export type LoaderAdapterType = 'fetch' | 'axios';

export type FetchAdapterFor<T extends LoaderAdapterType> =
	T extends 'fetch' ? FetchLoadAdapter
	: T extends 'axios' ? AxiosLoadAdapter
	: never;

export interface ModuleFederationFetchScriptAdapter {
	fetchScriptContent(url: string): Promise<ScriptContent>;
}

export interface ModuleFederationExecutorAdapter {
	execute<TFederatedModule extends WebpackModuleFederationRuntime>(
		scriptContent: ScriptContent,
	): Promise<ExecutorResult<TFederatedModule>>;
}

export interface LoadedModuleRemoteInfo {
	container: WebpackModuleFederationRuntime;
	loadedAt: number;
}
