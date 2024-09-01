import path, { dirname } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
	entry: './src/configureSpaContainer.mjs',
	experiments: {
		outputModule: true,
	},
	output: {
		filename: 'configureSpaContainer.mjs',
		path: path.resolve(__dirname, '../../', 'remote_modules', 'app'),
		library: {
			type: 'module',
		},
	},
	module: {
		rules: [
			{
				test: /\.mjs$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
		],
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
