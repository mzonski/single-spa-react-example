import { assertIsError } from '../../../utils';
import { ExecutorResult, ModuleFederationExecutorAdapter, ScriptContent } from '../types';
import { WebpackModuleFederationRuntime } from '../../webpackTypes';
import { combineScriptContent, withDefinedWebpackSourceUrl, withImportMetaUrlReplacement } from './utils';

export class EvalExecutorAdapter implements ModuleFederationExecutorAdapter {
	async execute<TFederatedModule extends WebpackModuleFederationRuntime>(
		remoteScriptContent: ScriptContent,
		publicPath: string,
	): Promise<ExecutorResult<TFederatedModule>> {
		try {
			const scriptContent = combineScriptContent(
				withImportMetaUrlReplacement(remoteScriptContent, publicPath),
				withDefinedWebpackSourceUrl(publicPath),
			);

			const module = eval(scriptContent) as TFederatedModule;

			return { success: true, module };
		} catch (error) {
			assertIsError(error);
			return { success: false, error };
		}
	}
}
