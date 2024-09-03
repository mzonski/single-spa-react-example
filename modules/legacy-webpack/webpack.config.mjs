// @ts-check
import path, { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';

/** @type {new (options: import('webpack').container.ModuleFederationPluginOptions) => InstanceType<import('webpack').container.ModuleFederationPlugin>} */
const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('webpack').Configuration} */
const webpackConfig = {
	entry: {},
	output: {
		clean: true,
		uniqueName: 'legacy_module',
		filename: '[name].bundle.js',
		chunkFilename: '[name].chunk.js',
		publicPath: 'http://localhost:3322/legacy/',
		path: path.resolve(__dirname, '../../', 'remote_modules', 'legacy'),
		scriptType: 'module',
		module: true,
		library: {
			type: 'module',
		},
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
		],
	},
	experiments: {
		outputModule: true,
	},
	optimization: {
		minimize: false,
		moduleIds: 'named',
		chunkIds: 'named',
		splitChunks: {
			cacheGroups: {
				'react': {
					test: /[\\/]node_modules[\\/](react|scheduler|react-dom)[\\/]/,
					name: 'react.shared',
					chunks: 'all',
					priority: 99,
					enforce: true,
				},
				'single-spa': {
					test: /[\\/]node_modules[\\/](single-spa-react|single-spa-layout|single-spa)[\\/]/,
					name: 'single-spa.shared',
					chunks: 'all',
					priority: 80,
					enforce: true,
				},
				'commons': {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					priority: 0,
					chunks: 'all',
				},
				'default': {
					name: 'internal.default',
					priority: 0,
					reuseExistingChunk: true,
				},
			},
		},
	},
	plugins: [
		new ModuleFederationPlugin({
			name: 'legacy_module',
			filename: 'remoteEntry.js',
			remoteType: 'module',
			exposes: {
				'./spaApp': {
					import: './src/legacySpaApp.jsx',
					name: 'spa-app',
				},
				'./dummyScope1': {
					import: './src/dummyScope1.mjs',
					name: 'dummy1-scope',
				},
			},
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
	],
	cache: {
		type: 'filesystem',
		cacheLocation: resolve(__dirname, '../', 'webpack_cache', 'modules', 'legacy'),
		compression: false,
	},
};

export default webpackConfig;
