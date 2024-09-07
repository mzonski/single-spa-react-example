// @ts-check
const { resolve } = require('path');
const { defineConfig } = require('@rspack/cli');
const RefreshPlugin = require('@rspack/plugin-react-refresh');
const {
	container: { ModuleFederationPluginV1, ModuleFederationPlugin: ModuleFederationPluginV15 },
} = require('@rspack/core');
const { ModuleFederationPlugin: ModuleFederationPluginV20 } = require('@module-federation/enhanced/rspack');

const isDev = process.env.NODE_ENV === 'development';
const federationVersion = process.env.MF_VER;
let MFPlugin;
switch (process.env.MF_VER) {
	case '10':
		MFPlugin = ModuleFederationPluginV1;
		break;
	case '15':
		MFPlugin = ModuleFederationPluginV15;
		break;
	case '20':
		MFPlugin = ModuleFederationPluginV20;
		break;
	default:
		throw new Error(`Module federation plugin version not specified. (process.env.MF_VER === 10 || 15 || 20)`);
}

const name = 'modern' + federationVersion;

const targets = [
	'last 2 Chrome versions',
	'last 2 Firefox versions',
	'last 2 Edge versions',
	'last 2 Safari versions',
	'not dead',
];

module.exports = defineConfig({
	context: __dirname,
	output: {
		clean: true,
		uniqueName: `${name}_module`,
		filename: '[name].bundle.js',
		chunkFilename: '[name].chunk.js',
		path: resolve(__dirname, '../../', 'remote_modules', name),
		scriptType: 'module',
		module: true,
		library: {
			type: 'module',
		},
		chunkLoadingGlobal: `${name}_module`,
	},
	entry: {},
	resolve: {
		extensions: ['...', '.ts', '.tsx', '.jsx'],
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: 'asset',
			},
			{
				test: /\.(jsx?|tsx?)$/,
				use: [
					{
						loader: 'builtin:swc-loader',
						/** @type {import('@rspack/core').SwcLoaderOptions} */
						options: {
							jsc: {
								parser: {
									syntax: 'typescript',
									tsx: true,
								},
								transform: {
									react: {
										runtime: 'automatic',
										development: isDev,
										refresh: isDev,
									},
								},
							},
							env: { targets },
						},
					},
				],
			},
		],
	},
	plugins: [
		isDev ? new RefreshPlugin() : null,
		new ModuleFederationPluginV1({
			name: `${name}_module`,
			exposes: {
				'./spaApp': `./src/spaApp${federationVersion}.tsx`,
			},
			remoteType: 'module',
			filename: 'remoteEntry.js',
			// runtimePlugins: [resolve(__dirname, 'src', 'mf-module-logger.mjs')],
			shared: {
				'react': {
					singleton: true,
					requiredVersion: '18.3.1',
					strictVersion: true,
				},
				'react-dom': {
					singleton: true,
					requiredVersion: '18.3.1',
					strictVersion: true,
				},
				'react-dom/client': {
					singleton: true,
					requiredVersion: '18.3.1',
					strictVersion: true,
				},
				'single-spa': {
					singleton: true,
					requiredVersion: '6.0.1',
					strictVersion: true,
				},
				'single-spa-react': {
					singleton: true,
					requiredVersion: '6.0.1',
					strictVersion: true,
				},
			},
		}),
	].filter(Boolean),
	optimization: {
		minimize: false,
		moduleIds: 'named',
		chunkIds: 'named',
	},
	experiments: {
		css: true,
	},
});
