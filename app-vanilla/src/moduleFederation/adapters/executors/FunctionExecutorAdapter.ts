import { ExecutorResult, ModuleFederationExecutorAdapter, ScriptContent } from '../types';
import { WebpackModuleFederationRuntime } from '../../webpackTypes';
import { assertIsError } from '../../../utils';

const withExportedWebpackDefaults = (scriptContent: ScriptContent) => {
	return `
  return (function() {
    ${scriptContent}
    return __webpack_exports__;
  })();
`;
};

export class FunctionExecutorAdapter implements ModuleFederationExecutorAdapter {
	async execute<TFederatedModule extends WebpackModuleFederationRuntime>(
		scriptContent: ScriptContent,
	): Promise<ExecutorResult<TFederatedModule>> {
		try {
			const factory = new Function(withExportedWebpackDefaults(scriptContent));
			const result = factory() as TFederatedModule;

			return { success: true, module: result };
		} catch (error) {
			assertIsError(error);
			return { success: false, error };
		}
	}
}
