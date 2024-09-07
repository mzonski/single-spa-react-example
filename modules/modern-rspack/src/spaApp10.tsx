import React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOMClient from 'react-dom/client';

function ModernApp() {
	return (
		<div>
			<h1>RS Module 1.0</h1>
			<p>This module is bundled using RSPack and uses Module Federation 1.0.</p>
		</div>
	);
}

const lifecycles = singleSpaReact({
	React,
	ReactDOMClient,
	rootComponent: ModernApp,
});

export const { bootstrap, mount, unmount, update } = lifecycles;
