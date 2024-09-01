declare module 'http://localhost:3322/legacy/legacyModule.mjs' {
	import { LifeCycles } from 'single-spa';
	export const bootstrap: LifeCycles['bootstrap'];
	export const mount: LifeCycles['mount'];
	export const unmount: LifeCycles['unmount'];
	export const update: LifeCycles['update'];
}
