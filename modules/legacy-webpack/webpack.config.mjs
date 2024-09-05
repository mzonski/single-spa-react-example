// @ts-check
import path, { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';

/** @type {new (options: import('webpack').container.ModuleFederationPluginOptions) => InstanceType<import('webpack').container.ModuleFederationPlugin>} */
const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default (env, argv) => {
	const isDev = argv.mode === 'development';

	/** @type {import('webpack').Configuration} */
	const webpackConfig = {
		entry: {
			legacy_module: './src/setupRemoteRuntime',
		},
		output: {
			clean: true,
			uniqueName: 'legacy_module',
			filename: '[name].bundle.js',
			chunkFilename: '[name].chunk.js',
			path: path.resolve(__dirname, '../../', 'remote_modules', 'legacy'),
			scriptType: 'module',
			module: true,
			library: {
				type: 'module',
			},
			chunkLoadingGlobal: 'legacy_module',
		},
		resolve: { extensions: ['.js', '.mjs', '.cjs'] },
		module: {
			rules: [
				{
					test: /\.([mc]?js)(x?)$/,
					exclude: /node_modules/,
					include: /src/,
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
		],
		devServer: {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': '*',
				'Access-Control-Allow-Headers': '*',
			},
		},
		cache: {
			type: 'filesystem',
			cacheLocation: resolve(__dirname, '../../', 'node_modules', '.cache', 'webpack', 'modules', 'legacy'),
			compression: false,
		},
	};

	return webpackConfig;
};
