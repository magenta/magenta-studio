/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const fs = require('fs')
const { argv } = require('yargs')
const { resolve } = require('path')
const { version } = require('./package.json')
const { ModuleFilenameHelpers } = require('webpack')

function getDefinitions(env, width = 100, height = 100) {
	return new webpack.DefinePlugin({
		PRODUCTION: JSON.stringify(Boolean(env.production)),
		// ANIMATE : JSON.stringify(Boolean(env.animate)),
		ANIMATE: JSON.stringify(false),
		INDEX_FILE: JSON.stringify('index.html'),
		ABOUT_FILE: JSON.stringify('about.html'),
		WIDTH: JSON.stringify(width),
		HEIGHT: JSON.stringify(height),
		VERSION: JSON.stringify(require("./package.json").version),
	})
}

module.exports = (env = {}) => {
	const templateParameters = { version }
	const definitions = getDefinitions(env)
	const PRODUCTION = env.production;
	return {
		mode: PRODUCTION ? 'production' : 'development',
		devtool: PRODUCTION ? undefined : 'eval-cheap-module-source-map',
		entry: {
			Renderer: [path.resolve(__dirname, 'client/index.js')],
			components: [path.resolve(__dirname, 'client/components/index.js')]
		},
		output: {
			path: path.resolve(__dirname, 'magenta4live.amxd/code/public'),
			filename: '[name].js',
			publicPath: '/'
		},
		resolve: {
			modules: [
				'node_modules',
				path.resolve(__dirname, '.'),
			],
			fallback: {
				"buffer": require.resolve("buffer")
			}
		},
		plugins: [
			definitions,
			new HtmlWebpackPlugin({
				title: 'Main',
				filename: 'index.html',
				template: path.resolve(__dirname, 'template.html'),
				templateParameters
			})],
		module: {
			rules: [
				{
					test: /\.scss$/,
					use: ['style-loader', 'css-loader', 'sass-loader']
				},
				{
					test: /\.(png|jpe?g|gif|svg)$/i,
					use: [
						{
							loader: 'file-loader',
						},
					],
				},
			]
		}
	}
}
