import { ExecutorAdapterType, isExecutorFailed, LoadedModuleRemoteInfo, LoaderAdapterType } from './adapters/types';
import { createExecutor, createLoader } from './adapters/factories';
import { WebpackModuleFederationRuntime } from './webpackTypes';
import { withErrorHandling } from './utils/errorHandlingMixin';
import { getRemoteModulePublicPath } from './utils/getRemoteModulePublicPath';
import { createEvent, EventEmitterMixin } from './mixins/eventEmitter';
import { assertIsError, extendError } from '../utils';
import { Logger } from '../core/Logger';
import { ModuleFactoryUndefinedError, ModuleInfoUndefinedError, ScopeNotRegisteredError } from './errors';

interface IModuleFederationLoader {
	loadRemoteModule(url: string, scopeName: string): Promise<void>;
	isScopeRegistered(scopeName: string): boolean;
	importModule<T>(scopeName: string, moduleName: string): Promise<T>;
}

export class ModuleFederationManager extends EventEmitterMixin(class {}) implements IModuleFederationLoader {
	readonly #loaderAdapter: ReturnType<typeof createLoader<LoaderAdapterType>>;
	readonly #executorAdapter: ReturnType<typeof createExecutor<ExecutorAdapterType>>;
	readonly #loadedRemotes: Map<string, LoadedModuleRemoteInfo> = new Map();
	readonly #logger = new Logger('app:ModuleFederationManager');

	constructor(loaderType: LoaderAdapterType, executorType: ExecutorAdapterType) {
		super();
		this.#loaderAdapter = createLoader(loaderType);
		this.#executorAdapter = createExecutor(executorType);
	}

	async loadRemoteModule(url: string, scopeName: string, forceReload: boolean = false) {
		this.emit(createEvent('load', 'start', { scopeName, url }));

		if (this.#loadedRemotes.has(scopeName) && !forceReload) {
			this.#logger.warn(`Scope "${scopeName}" is already loaded`);
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
			this.emit(createEvent('load', 'success', { scopeName, url }));
		} catch (error) {
			this.emit(createEvent('load', 'error', { scopeName, error }));
			assertIsError(error);
			throw extendError(error, `Failed to load and evaluate remote module "${scopeName}" from ${url}`);
		}
	}

	async importModule<T>(scopeName: string, moduleName: string) {
		this.emit(createEvent('import', 'start', { scopeName, moduleName }));

		if (!this.isScopeRegistered(scopeName)) {
			const error = new ScopeNotRegisteredError(scopeName);
			this.emit(createEvent('import', 'error', { scopeName, error }));
			throw error;
		}

		const moduleInfo = this.#loadedRemotes.get(scopeName);
		if (!moduleInfo) {
			const error = new ModuleInfoUndefinedError(scopeName);
			this.emit(createEvent('import', 'error', { scopeName, error }));
			throw error;
		}

		try {
			const factory = await moduleInfo.container.get<T>(moduleName);

			if (!factory) {
				throw new ModuleFactoryUndefinedError(scopeName, moduleName);
			}

			const module = factory();
			this.emit(createEvent('import', 'success', { scopeName, moduleName }));
			return module;
		} catch (error) {
			this.emit(createEvent('import', 'error', { scopeName, error }));
			assertIsError(error);
			throw extendError(error, `Failed to import module "${moduleName}" from scope "${scopeName}`);
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
