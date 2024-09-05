import { assertIsError } from '../../../utils';
import { ExecutorResult, ModuleFederationExecutorAdapter, ScriptContent } from '../types';
import { WebpackModuleFederationRuntime, WebpackRuntime } from '../../webpackTypes';
import {
	withDefinedWebpackSourceUrl,
	withModuleDefaultExport,
	withModulePublicPathDefined,
	withModuleRuntimeSetup,
} from './utils';

const setupRemoteRuntime = (moduleRuntime: WebpackRuntime) => {
	console.log('Runtime public path', moduleRuntime['p']);
};

export class BlobImportExecutorAdapter implements ModuleFederationExecutorAdapter {
	async execute<TFederatedModule extends WebpackModuleFederationRuntime>(
		remoteScriptContent: ScriptContent,
		publicPath?: string,
	): Promise<ExecutorResult<TFederatedModule>> {
		try {
			const blob = new Blob(
				[
					withModuleRuntimeSetup(setupRemoteRuntime),
					withModulePublicPathDefined(publicPath),
					remoteScriptContent,
					withModuleDefaultExport(),
					withDefinedWebpackSourceUrl(publicPath),
				],
				{
					type: 'application/ecmascript',
				},
			);

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
