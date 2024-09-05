import { Brand, ValueType } from '../utilityTypes';

/**
 * Function that loads a modules from a bundle into provided runtime
 */
type WebpackModuleLoader = (runtime: typeof __webpack_require__) => void;

/**
 * Function that retrieves modules of chunk and stores it inside __webpack_exports__ to be retrieved by utilizing webpack api.
 */
export type WebpackChunkLoadingFunction = (
	_unused_in_es_modules: object | undefined,
	webpack_exports: Record<string | number, unknown>,
	webpack_runtime: typeof __webpack_require__,
) => void;

export type ModulePath = Brand<string, 'ModulePath'>;
export type WebpackChunkId = Brand<string | number, 'ChunkId'>;

type WebpackModules = {
	[K in ModulePath]: WebpackChunkLoadingFunction;
};

export type WebpackRuntimeChunk = [WebpackChunkId[], WebpackModules];
export type WebpackRuntimeBundle = [WebpackChunkId[], WebpackModules, WebpackModuleLoader];
export type WebpackRuntimeScope = WebpackRuntimeChunk | WebpackRuntimeBundle;

export type WebpackScopeName<T extends string = string> = string | `webpackChunk${T}`;
/**
 * Represents the global scope for shared modules in Webpack.<br>
 * Correlates with output.globalObject and contains all loaded scopes.<br>
 * The key is determined by output.chunkLoadingGlobal or 'webpackChunk' + output.uniqueName.
 */
export type WebpackGlobalObject = {
	[K in WebpackScopeName]: WebpackRuntimeScope[];
} & { push: (parentLoadingFunction: WebpackChunkLoadingFunction, scope: WebpackRuntimeScope) => void };

type WebpackShareScope = ValueType<typeof __webpack_share_scopes__>;
export type ModuleFactory<T> = () => Promise<T>;

export interface WebpackModuleFederationRuntime {
	/**
	 * Get a module from the container
	 * @param moduleName - The name of the module to retrieve
	 * @param getScope - Array of scopes to lookup for a module
	 * @returns A promise that resolves to the requested module
	 */
	get<T = any>(moduleName: string, getScope?: any): Promise<ModuleFactory<T>>;

	/**
	 * Initializes the remote container with the given shared scope.
	 *
	 * @param shareScope - The shared scope object
	 * @param initScope - Optional initialization scope
	 * @returns A promise that resolves when the initialization is complete.
	 */
	init(shareScope: WebpackShareScope, initScope?: WebpackRuntimeScope[]): Promise<void>;
}

// TODO: Define types
export type WebpackRuntime = Record<string, (...args: any[]) => any>;
