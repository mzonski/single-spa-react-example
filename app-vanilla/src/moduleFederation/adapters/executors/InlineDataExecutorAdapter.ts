import { assertIsError } from '../../../utils';
import { ExecutorResult, ModuleFederationExecutorAdapter, ScriptContent } from '../types';
import { WebpackModuleFederationRuntime } from '../../webpackTypes';
import { createInlineData } from '../../utils/createInlineData';
import {
	combineScriptContent,
	withDefinedWebpackSourceUrl,
	withModuleDefaultExport,
	withModulePublicPathDefined,
} from './utils';

export class InlineDataExecutorAdapter implements ModuleFederationExecutorAdapter {
	async execute<TFederatedModule extends WebpackModuleFederationRuntime>(
		remoteScriptContent: ScriptContent,
		publicPath?: string,
	): Promise<ExecutorResult<TFederatedModule>> {
		try {
			const scriptContent = combineScriptContent(
				withModulePublicPathDefined(publicPath),
				remoteScriptContent,
				withModuleDefaultExport(),
				withDefinedWebpackSourceUrl(publicPath),
			);
			const inlineData = createInlineData('application/ecmascript', scriptContent);
			const module = await import(/* webpackIgnore: true */ inlineData);

			return { success: true, module: module.default as TFederatedModule };
		} catch (error) {
			assertIsError(error);
			return { success: false, error };
		}
	}
}
