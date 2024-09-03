import { assertIsError } from '../../../utils';
import { ExecutorResult, ModuleFederationExecutorAdapter, ScriptContent } from '../types';
import { WebpackModuleFederationRuntime } from '../../webpackTypes';

export class EvalExecutorAdapter implements ModuleFederationExecutorAdapter {
	async execute<TFederatedModule extends WebpackModuleFederationRuntime>(
		scriptContent: ScriptContent,
	): Promise<ExecutorResult<TFederatedModule>> {
		try {
			const module = eval(scriptContent) as TFederatedModule;
			return { success: true, module };
		} catch (error) {
			assertIsError(error);
			return { success: false, error };
		}
	}
}
