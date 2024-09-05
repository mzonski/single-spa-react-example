import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';

const LegacyApp = () => (
	<div>
		<h1>Legacy Module</h1>
		<p>This module is bundled using Webpack.</p>
	</div>
);

const lifecycles = singleSpaReact({
	React,
	ReactDOMClient,
	rootComponent: LegacyApp,
});

export const { bootstrap, mount, unmount, update } = lifecycles;
