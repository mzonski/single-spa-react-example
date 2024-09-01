import path, { dirname } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';

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
				transpileOnly,
			},
		},
	};
}

const config = {
	entry: './src/configureSpaContainer.ts',
	experiments: {
		outputModule: true,
	},
	output: {
		filename: 'spaContainer.js',
		path: path.resolve(__dirname, '../', 'remote_modules', 'app'),
		library: {
			type: 'module',
		},
	},
	module: {
		rules: [createScriptLoaderRule('ts')],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			inject: 'head',
			scriptLoading: 'module',
		}),
	],
	devServer: {
		historyApiFallback: true,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': '*',
			'Access-Control-Allow-Headers': '*',
		},
	},
};

export default config;
