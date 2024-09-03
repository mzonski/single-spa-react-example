import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';

const LegacyApp = () => (
	<div>
		<h1>Legacy Module</h1>
		<p>This module is bundled using Webpack.</p>
	</div>
);

const lifecycles = singleSpaReact({
	React,
	ReactDOM,
	rootComponent: LegacyApp,
});

export const { bootstrap, mount, unmount, update } = lifecycles;
