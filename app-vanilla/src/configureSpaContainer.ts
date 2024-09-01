import { registerApplication, start } from 'single-spa';

const loadLegacyModule = () => import('http://localhost:3322/legacy/legacyModule.mjs');

registerApplication({
	name: '@zonia-test/legacy',
	app: loadLegacyModule,
	activeWhen: ['/'],
});

start();
