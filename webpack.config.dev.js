const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

let noRefresh = false;
if (process.env.NO_REFRESH) {
	noRefresh = true;
	console.log('Disabling Refresh.');
}

module.exports = {
	entry: './src/index.tsx',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.(js|mjs|jsx|ts|tsx)$/,
				enforce: 'pre',
				exclude: /node_modules/,
				loader: ['eslint-loader']
			},
			{
				test: /\.(js|mjs|jsx|ts|tsx)$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							esModule: false
						}
					}
				]
			},
			{
				test: /\.svg$/,
				use: ['url-loader']
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				// exclude: path.resolve(__dirname, 'node_modules'), --- DON'T NEED WHEN USING RS-ACCORDION
				use: [
					{
						loader: 'url-loader',
						options: {
							prefix: 'font',
							limit: 10000,
							mimetype: 'application/octet-stream'
						}
					}
				]
			},
			{
				test: /\.(woff|woff2|eot)$/,
				use: {
					loader: 'url-loader'
				}
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.jsx']
	},
	// inlines source maps into final bundle. This works well for android. Not good for production
	devtool: 'source-map',
	plugins: [
		// copies assets from src to dest
		new CopyPlugin([
			{ from: './src/fonts', to: './fonts' },
			{ from: './src/images', to: './images' },
			{ from: './public', to: './' }
		]),
		// Inserts script tags inside index.html and places index.html into dist
		new HtmlWebpackPlugin({
			template: './public/index.html'
		}),
		// Delete all files inside output.path first
		new CleanWebpackPlugin()
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'build'),
		publicPath: '/'
	},
	devServer: {
		port: 3002,
		compress: true,
		liveReload: !noRefresh,
		hot: !noRefresh,
		open: true,
		openPage: 'http://localhost:3002',
		overlay: true,
		historyApiFallback: true,
		host: '0.0.0.0',
		proxy: {
			'/api': 'http://localhost:3001'
		}
	}
};
