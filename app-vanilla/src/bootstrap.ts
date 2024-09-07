import React, { createElement } from 'react';
import ReactDOMClient, { createRoot } from 'react-dom/client';
import { LifeCycles, registerApplication, start } from 'single-spa';
import singleSpaReact from 'single-spa-react';
import { ModuleFederationManager } from './moduleFederation/ModuleFederationManager';
import ansiFormatter from './core/ansi/ANSIStringFormatter';

const moduleManager = new ModuleFederationManager('fetch', 'eval');

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
	await moduleManager.loadRemoteModule('http://localhost:3322/legacy/remoteEntry.js', 'legacyModule');
	// await moduleManager.loadRemoteModule('http://localhost:8081/remoteEntry.js', 'legacyModule');
	const spaApp = await moduleManager.importModule<LifeCycles>('legacyModule', './spaApp');

	registerApplication({
		name: '@zonia-test/legacyApp',
		app: spaApp,
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
