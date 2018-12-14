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

function getDefinitions(env, width=100, height=100){
	return new webpack.DefinePlugin({
		PRODUCTION : JSON.stringify(Boolean(env.production)),
		INDEX_FILE : JSON.stringify('index.html'),
		ABOUT_FILE : JSON.stringify('about.html'),
		ABLETON : JSON.stringify(!env.standalone),
		WIDTH : JSON.stringify(width),
		HEIGHT : JSON.stringify(height)
	})
}

function getCommonConfig(name, mainFile, env, width, height){

	const definitions = getDefinitions(env, width, height)

	return {
		mode : env.production ? 'production' : 'development',
		context : __dirname,
		output : {
			path : path.resolve(__dirname, name, './build'),
			filename : '[name].js'
		},
		resolve : {
			modules : [
				'node_modules',
				path.resolve(__dirname, '.'),
			],
		},
		plugins : [definitions],
		module : {
			rules : [
				{ 
					test : /\.js$/, 
					exclude : /node_modules/, 
					loader : 'babel-loader' 
				},
				{ 
					test : /\.scss$/, 
					loader : 'style-loader!css-loader!sass-loader' 
				},
			]
		},
		devtool : env.production ? '' : 'source-map'
	}
}

function componentConfig(name, mainFile, env, width, height){
	const config = {}
	Object.assign(config, getCommonConfig(name, mainFile, env, width, height), {
		entry : {
			components : ['core-js', mainFile],
		},
		output : {
			path : path.resolve(__dirname, './build'),
			filename : '[name].js'
		},
		target : 'electron-renderer',
	})
	return config
}

function makeConfig(name, mainFile, env, width=380, height=520){

	const commonConfig = getCommonConfig(name, mainFile, env, width, height)

	const definitions = getDefinitions(env, width, height)

	const templateParameters = { components : env.production ? 'components.js' : '../../build/components.js' }
	
	return [
		//electron main
		Object.assign({}, commonConfig, {
			entry : {
				Main : './electron/Main.js',
			},
			target : 'electron-main',
		}),
		//electron renderer
		Object.assign({}, commonConfig, {
			entry : {
				Renderer : [mainFile],
			},
			plugins : [
				definitions, 
				new HtmlWebpackPlugin({ title : 'Main', 
					filename : 'index.html', 
					template : './electron/template.html',
					templateParameters
				}),
				new HtmlWebpackPlugin({ title : 'About', 
					filename : 'about.html', 
					inject : false,
					template : './electron/about.html',
					templateParameters
				}),
				new HtmlWebpackPlugin({ title : 'Popup', 
					filename : 'popup.html', 
					inject : false,
					template : './electron/popup.html',
					templateParameters
				}),
			],
			target : 'electron-renderer',
		})
	]
}

module.exports = env => {
	const continueConfig = makeConfig('continue', './continue/Main.js', env, 375, 600)
	const groovaeConfig = makeConfig('groovae', './groovae/Main.js', env, 330, 450)
	const interpolateConfig = makeConfig('interpolate', './interpolate/Main.js', env, 375, 580)
	const generateConfig = makeConfig('generate', './generate/Main.js', env, 375, 540)
	const componentsConfig = componentConfig('components', './components/index.js', env)
	if (env.continue){
		return continueConfig
	} else if (env.groovae){
		return groovaeConfig
	} else if (env.interpolate){
		return interpolateConfig
	} else if (env.generate){
		return generateConfig
	} else if (env.components){
		return componentsConfig
	} else if (env.all){
		return [...continueConfig, ...groovaeConfig, ...interpolateConfig, ...generateConfig, componentsConfig]
	}
}
