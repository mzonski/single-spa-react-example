import { ExecutorResult, ModuleFederationExecutorAdapter, ScriptContent } from '../types';
import { WebpackModuleFederationRuntime } from '../../webpackTypes';
import { assertIsError } from '../../../utils';
import {
	combineScriptContent,
	withDefinedWebpackSourceUrl,
	withIife,
	withImportMetaUrlReplacement,
	withReturnWebpackExports,
} from './utils';

export class FunctionExecutorAdapter implements ModuleFederationExecutorAdapter {
	async execute<TFederatedModule extends WebpackModuleFederationRuntime>(
		remoteScriptContent: ScriptContent,
		publicPath?: string,
	): Promise<ExecutorResult<TFederatedModule>> {
		try {
			const scriptContent = combineScriptContent(
				withIife(withImportMetaUrlReplacement(remoteScriptContent, publicPath), withReturnWebpackExports()),
				withDefinedWebpackSourceUrl(publicPath),
			);

			const scriptContentFunction = new Function(scriptContent);
			const result = scriptContentFunction() as TFederatedModule;

			return { success: true, module: result };
		} catch (error) {
			assertIsError(error);
			return { success: false, error };
		}
	}
}
