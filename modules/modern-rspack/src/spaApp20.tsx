import React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOMClient from 'react-dom/client';

const Federation2App = () => (
	<div>
		<h1>Federation2 RS Module</h1>
		<p>This module is bundled using RSPack and uses Module Federation 2.0.</p>
	</div>
);

const lifecycles = singleSpaReact({
	React,
	ReactDOMClient,
	rootComponent: Federation2App,
});

export const { bootstrap, mount, unmount, update } = lifecycles;
