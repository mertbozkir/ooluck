const path = require('node:path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	entry: './src/main.ts',
	mode: 'production',
	target: 'node',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@test': path.resolve(__dirname, 'test')
		}
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()]
	},
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'commonjs2'
	},
	stats : 'errors-only'
};
