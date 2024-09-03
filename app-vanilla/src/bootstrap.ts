import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { LifeCycles, registerApplication, start } from 'single-spa';
import { ModuleFederationManager } from './moduleFederation/ModuleFederationManager';

const createSimpleReactRoot = () => {
	const root = createRoot(document.getElementById('react-root'), {});
	root.render(createElement('div', { children: 'Welcome in the react world' }));
};

const dumbModuleLoader = async () => {
	// @ts-ignore
	// const module = await import('http://localhost:3322/legacy/remoteEntry.js');
	// console.log(Object.keys(module));
	// console.log('(dumbModuleLoader) module', module);
};

const initializeApp = async () => {
	createSimpleReactRoot();

	const moduleFederationLoader = new ModuleFederationManager('fetch', 'blob');
	await moduleFederationLoader.loadRemoteModule('http://localhost:3322/legacy/remoteEntry.js', 'legacyModule');
	const spaApp = await moduleFederationLoader.importModule<LifeCycles>('legacyModule', './spaApp');

	registerApplication({
		name: '@zonia-test/legacyApp',
		app: spaApp,
		activeWhen: ['/'],
	});

	start();
};

document.getElementById('load-btn').addEventListener('click', async () => {
	// await initializeApp();
	// await dumbAppLoader();
});

initializeApp();
