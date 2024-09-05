import { createScriptContent } from '../factories';
import { ScriptContent } from '../types';

export const withModulePublicPathDefined = (publicPath: string) =>
	createScriptContent(publicPath !== undefined ? `import.meta.url = "${publicPath}";` : '');

export const withModuleDefaultExport = () => createScriptContent('export default __webpack_exports__;');

export const withModuleRuntimeSetup = (runtime: Function) => {
	let setupRemoteRuntimeConst = `var m_setupRuntime = ${runtime.toString()};`;

	return createScriptContent(setupRemoteRuntimeConst);
};

export function combineScriptContent(...scriptContent: ScriptContent[]) {
	return scriptContent.join('\n');
}

export const withReturnWebpackExports = () => {
	return createScriptContent('return __webpack_exports__;');
};

export function withIife(...scriptContent: ScriptContent[]) {
	return createScriptContent(`return (function iife() { ${scriptContent.join('\n')} })();`);
}

export const withImportMetaUrlReplacement = (scriptContent: ScriptContent, publicPath: string) => {
	const modifiedScriptContent = scriptContent.replace(/import\.meta\.url/g, `"${publicPath}"`);
	return createScriptContent(modifiedScriptContent);
};

export const withDefinedWebpackSourceUrl = (publicPath: string) => {
	// TODO: Is dev environment check
	const url = new URL(publicPath);
	return createScriptContent(`//# sourceURL=webpack://${url.host}/enhancedRemoteEntry.js`);
};
