export class ModuleInfoUndefinedError extends Error {
	constructor(scopeName: string) {
		super(`Module info for scope "${scopeName}" is undefined`);
		this.name = 'ModuleInfoUndefinedError';
	}
}

export class ModuleFactoryUndefinedError extends Error {
	constructor(scopeName: string, moduleName: string) {
		super(`Factory for module "${moduleName}" is undefined.`);
		this.name = 'ModuleFactoryUndefinedError';
	}
}

export class ScopeNotRegisteredError extends Error {
	constructor(scopeName: string) {
		super(`Scope "${scopeName}" is not registered.`);
		this.name = 'ScopeNotRegisteredError';
	}
}
