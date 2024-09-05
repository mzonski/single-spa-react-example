// @ts-check
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

/** @type {new (options: import('webpack').container.ModuleFederationPluginOptions) => InstanceType<import('webpack').container.ModuleFederationPlugin>} */
const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @param {...string} extensions - The file extensions to format
 */
export function formatExtensionsToRegex(...extensions) {
	const formattedExtensions = extensions.map((ext) => (ext.startsWith('.') ? ext.slice(1) : ext));
	return `\\.(${formattedExtensions.join('|')})$`;
}

/**
 * @param {...string} extensions - The file extensions to format
 */
export function createScriptLoaderRule(...extensions) {
	const transpileOnly = extensions.some((ext) => ['js', 'jsx'].includes(ext.replace('.', '')));

	return {
		test: new RegExp(formatExtensionsToRegex(...extensions)),
		exclude: /node_modules/,
		use: {
			loader: 'ts-loader',
			options: {
				transpileOnly: transpileOnly,
			},
		},
	};
}

/** @type {import('webpack').Configuration} */
const config = {
	entry: {
		app_host: {
			import: './src/bootstrap.ts',
			runtime: 'react-runtime',
		},
	},
	experiments: {
		outputModule: true,
		topLevelAwait: true,
	},
	resolve: { extensions: ['.ts', '.js', '.mjs'] },
	output: {
		clean: true,
		uniqueName: 'app_host',
		publicPath: '/',
		path: resolve(__dirname, '../', 'remote_modules', 'app'),
		module: true,
		filename: '[name].bundle.js',
		chunkFilename: '[name].chunk.js',
	},
	module: {
		rules: [createScriptLoaderRule('ts')],
	},
	devServer: {
		historyApiFallback: true,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': '*',
			'Access-Control-Allow-Headers': '*',
		},
	},
	plugins: [
		/** @type {import('html-webpack-plugin')} */
		new HtmlWebpackPlugin({
			template: './src/index.html',
			inject: 'head',
			scriptLoading: 'module',
		}),
		new ModuleFederationPlugin({
			name: 'app_host',
			remoteType: 'module',
			runtime: 'react-runtime',
			library: { type: 'module' },
			shared: {
				'react': {
					singleton: true,
					requiredVersion: '18.3.1',
					eager: true,
					strictVersion: true,
				},
				'react-dom': {
					singleton: true,
					requiredVersion: '18.3.1',
					eager: true,
					strictVersion: true,
				},
				'react-dom/client': {
					singleton: true,
					requiredVersion: '18.3.1',
					eager: true,
					strictVersion: true,
				},
				'single-spa': {
					singleton: true,
					requiredVersion: '6.0.1',
					eager: true,
					strictVersion: true,
				},
				'single-spa-react': {
					singleton: true,
					requiredVersion: '6.0.1',
					eager: true,
					strictVersion: true,
				},
			},
		}),
	],
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
	cache: {
		type: 'filesystem',
		cacheLocation: resolve(__dirname, '../../', 'node_modules', '.cache', 'webpack', 'app_host'),
		compression: false,
	},
};

export default config;
