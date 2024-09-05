import { assertIsError } from '../utils';
import { ExecutorAdapterType, isExecutorFailed, LoadedModuleRemoteInfo, LoaderAdapterType } from './adapters/types';
import { createExecutor, createLoader } from './adapters/factories';
import { WebpackModuleFederationRuntime } from './webpackTypes';
import { withErrorHandling } from './utils/errorHandlingMixin';
import { getRemoteModulePublicPath } from './utils/getRemoteModulePublicPath';

interface IModuleFederationLoader {
	loadRemoteModule(url: string, scopeName: string): Promise<void>;
	isScopeRegistered(scopeName: string): boolean;
	importModule<T>(scopeName: string, moduleName: string): Promise<T>;
}

export class ModuleFederationManager implements IModuleFederationLoader {
	readonly #loaderAdapter: ReturnType<typeof createLoader<LoaderAdapterType>>;
	readonly #executorAdapter: ReturnType<typeof createExecutor<ExecutorAdapterType>>;
	readonly #loadedRemotes: Map<string, LoadedModuleRemoteInfo> = new Map();

	constructor(loaderType: LoaderAdapterType, executorType: ExecutorAdapterType) {
		this.#loaderAdapter = createLoader(loaderType);
		this.#executorAdapter = createExecutor(executorType);
	}

	async loadRemoteModule(url: string, scopeName: string, forceReload: boolean = false) {
		if (this.#loadedRemotes.has(scopeName) && !forceReload) {
			console.warn(`Scope "${scopeName}" is already loaded. Use forceReload=true to reload.`);
			return;
		}

		try {
			const publicPath = getRemoteModulePublicPath(url);
			const scriptContent = await this.#loaderAdapter.fetchScriptContent(url);
			const result = await this.#executorAdapter.execute(scriptContent, publicPath);

			if (isExecutorFailed(result)) {
				throw result.error;
			}

			const container = result.module;

			await this.#initializeWebpackShareScope();
			await this.#initializeContainerWithSharedScope(container);

			this.#storeLoadedRemote(scopeName, container);
		} catch (error) {
			assertIsError(error);
			throw new Error(`Failed to load and evaluate remote module "${scopeName}" from ${url}: ${error.message}`);
		}
	}

	async importModule<T>(scopeName: string, moduleName: string) {
		if (!this.isScopeRegistered(scopeName)) {
			throw new Error(`Scope "${scopeName}" is not registered.`);
		}

		const moduleInfo = this.#loadedRemotes.get(scopeName);
		if (!moduleInfo) {
			throw new Error(`Module info for scope "${scopeName}" is undefined.`);
		}

		try {
			const factory = await moduleInfo.container.get<T>(moduleName);

			if (!factory) {
				throw new Error(`Factory for module "${moduleName}" in scope "${scopeName}" is undefined.`);
			}
			return factory();
		} catch (error) {
			assertIsError(error);
			throw new Error(`Failed to import module "${moduleName}" from scope "${scopeName}": ${error.message}`);
		}
	}

	isScopeRegistered(scopeName: string) {
		return this.#loadedRemotes.has(scopeName);
	}

	async #initializeWebpackShareScope(sharedScopeName = 'default') {
		if (!!__webpack_share_scopes__[sharedScopeName]) {
			return;
		}

		await withErrorHandling(
			__webpack_init_sharing__(sharedScopeName),
			`Failed to initialize share scope "${sharedScopeName}"`,
		);
	}

	async #initializeContainerWithSharedScope(
		container: WebpackModuleFederationRuntime,
		sharedScopeName: string = 'default',
	) {
		await withErrorHandling(
			container.init(__webpack_share_scopes__[sharedScopeName]),
			`Failed to initialize container with shared scope "${sharedScopeName}"`,
		);
	}

	#storeLoadedRemote(scopeName: string, container: WebpackModuleFederationRuntime) {
		this.#loadedRemotes.set(scopeName, {
			container,
			loadedAt: Date.now(),
		});
	}
}
