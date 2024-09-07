import React, { createElement } from 'react';
import ReactDOMClient, { createRoot } from 'react-dom/client';
import { LifeCycles, registerApplication, start } from 'single-spa';
import singleSpaReact from 'single-spa-react';
import { ModuleFederationManager } from './moduleFederation/ModuleFederationManager';
import ansiFormatter from './core/ansi/ANSIStringFormatter';

const moduleManager = new ModuleFederationManager('fetch', 'eval');

moduleManager.on('import', 'start', (payload) => {
	console.log('payload', payload);
});
const createSimpleReactRoot = () => {
	const root = createRoot(document.getElementById('react-root')!, {});
	root.render(createElement('div', { children: 'Welcome in the react world' }));
};

const createSimpleSingleSpaApp = () => {
	const Element = createElement('div', { children: 'Hello from Single SPA' });

	const lifecycles = singleSpaReact({
		React,
		ReactDOMClient,
		rootComponent: () => (() => Element)(),
	});

	registerApplication({
		name: '@zonia-test/rootApp',
		app: lifecycles,
		activeWhen: ['/'],
	});
};

const createSimpleModuleManagement = async () => {
	await Promise.all([
		moduleManager.loadRemoteModule('http://localhost:3322/legacy/remoteEntry.js', 'legacy'),
		moduleManager.loadRemoteModule('http://localhost:3322/modern10/remoteEntry.js', 'modern10'),
		moduleManager.loadRemoteModule('http://localhost:3322/modern15/remoteEntry.js', 'modern15'),
		moduleManager.loadRemoteModule('http://localhost:3322/modern20/remoteEntry.js', 'modern20'),
	]);

	const [legacy, modern10, modern15, modern20] = await Promise.all([
		moduleManager.importModule<LifeCycles>('legacy', './spaApp'),
		moduleManager.importModule<LifeCycles>('modern10', './spaApp'),
		moduleManager.importModule<LifeCycles>('modern15', './spaApp'),
		moduleManager.importModule<LifeCycles>('modern20', './spaApp'),
	]);

	registerApplication({
		name: '@zonia-test/legacyApp',
		app: legacy,
		activeWhen: ['/'],
	});

	registerApplication({
		name: '@zonia-test/modern10App',
		app: modern10,
		activeWhen: ['/'],
	});
	registerApplication({
		name: '@zonia-test/modern15App',
		app: modern15,
		activeWhen: ['/'],
	});

	registerApplication({
		name: '@zonia-test/modern20App',
		app: modern20,
		activeWhen: ['/'],
	});
};

let isInitialized = false;

const initializeApp = async () => {
	isInitialized = true;
	createSimpleReactRoot();
	createSimpleSingleSpaApp();
	await createSimpleModuleManagement();

	start();
};

document.getElementById('load-btn')!.addEventListener('click', async () => {
	if (isInitialized) return;

	await initializeApp();
});

initializeApp().then(() => console.log(ansiFormatter.rainbow('Initialized')));
