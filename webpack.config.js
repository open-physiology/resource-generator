var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	context: __dirname + '/src',
	entry: './index.js',
	output: {
		path: __dirname + '/dist',
		filename: 'index.js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html'
		}),
		new CopyWebpackPlugin([
			{ from: 'main.css' },
			{ from: 'icons', to: 'icons' }
		])
	]
};
