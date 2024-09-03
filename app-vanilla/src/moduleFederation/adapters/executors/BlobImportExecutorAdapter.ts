import { assertIsError } from '../../../utils';
import { ExecutorResult, ModuleFederationExecutorAdapter, ScriptContent } from '../types';
import { WebpackModuleFederationRuntime } from '../../webpackTypes';

export class BlobImportExecutorAdapter implements ModuleFederationExecutorAdapter {
	async execute<TFederatedModule extends WebpackModuleFederationRuntime>(
		moduleSource: ScriptContent,
	): Promise<ExecutorResult<TFederatedModule>> {
		try {
			const blob = new Blob([moduleSource + 'export default __webpack_exports__;'], {
				type: 'application/ecmascript',
			});
			const blobUrl = URL.createObjectURL(blob);
			const loadedModule = await import(/* webpackIgnore: true */ blobUrl);

			URL.revokeObjectURL(blobUrl);
			return { success: true, module: loadedModule.default as TFederatedModule };
		} catch (error) {
			assertIsError(error);
			return { success: false, error };
		}
	}
}
