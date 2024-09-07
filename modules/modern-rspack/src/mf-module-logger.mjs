export default function () {
	console.log('=>(mf-module-logger) MFModule logger init');
	return {
		name: 'logger',
		beforeInit(args) {
			console.log('[MF] beforeInit: ', args);
			return args;
		},
		init(args) {
			console.log('[MF] init: ', args);
			return args;
		},
		beforeLoadShare(args) {
			console.log('[MF] beforeLoadShare: ', args);
			return args;
		},
		beforeInitContainer(args) {
			console.log('[MF] beforeInitContainer: ', args);
			return args;
		},
		initContainer(args) {
			console.log('[MF] initContainer: ', args);
			return args;
		},
		afterResolve(args) {
			console.log('[MF] afterResolve: ', args);
			return args;
		},
		loadShare(args) {
			console.log('[MF] loadShare: ', args);
			return args;
		},
		resolveShare(args) {
			console.log('[MF] resolveShare: ', args);
			return args;
		},
		initContainerShareScopeMap(args) {
			console.log('[MF] initContainerShareScopeMap: ', args);
			return args;
		},
	};
}
