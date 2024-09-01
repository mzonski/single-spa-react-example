import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const webpackConfig = {
	entry: './src/legacySpaApp.jsx',
	output: {
		filename: 'legacyModule.mjs',
		publicPath: 'http://localhost:3322/legacy',
		path: path.resolve(__dirname, '../../', 'remote_modules', 'legacy'),
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
};

export default webpackConfig;
