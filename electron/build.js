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

const packager = require('electron-packager')
const { resolve, basename, dirname } = require('path')
const glob = require('glob-promise')
const fs = require('fs-extra')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const { spawn } = require('child_process')
require('colors')
const tmp = require('tmp')
const packageJson = require('../package.json')
const apps = require('../apps.json')
const argv = require('yargs').argv

async function main(){

	if (argv.output === 'windows-ableton' || argv.output === true){
		await buildAndCompress('windows', 'ableton')
	}

	if (argv.output === 'mac-ableton' || argv.output === true){
		await buildAndCompress('macOS', 'ableton')
	}

	if (argv.output === 'mac-standalone' || argv.output === true){
		await buildAndCompress('macOS', 'standalone')
	}
}

async function buildAndCompress(platform, type){

	const { version } = packageJson
	const outName = `${platform}-${type}-${version}`

	// const buildDir = resolve(__dirname, '../dist/build')
	const buildDir = tmp.dirSync().name

	console.log(`BUILDING ${type.toUpperCase()}`.green)
	await runNpm(`webpack:${type === 'standalone' ? 'standalone' : 'build'}`)

	//bundle the output
	console.log('BUNDLING'.green)
	await output(platform, buildDir)
	//copy to its location
	let outputDir = resolve(__dirname, '../dist', outName)
	await fs.remove(outputDir)
	await fs.ensureDir(outputDir)

	if (type === 'standalone'){
		await moveFiles(buildDir, outputDir)
	} else {
		const maxDir = resolve(__dirname, '../magenta4live.amxd/')
		outputDir = resolve(outputDir, './magenta4live.amxd/')
		//copy the max dir to the output folder
		await fs.copy(maxDir, outputDir)
		//move files to the apps folder
		outputDir = resolve(outputDir, './apps')
		await moveFiles(buildDir, outputDir, platform === 'windows')
	}

	//create a folder for signing
	await toBeSigned(resolve(__dirname, `../dist/to-sign/${outName}`), outputDir, type)
}

/**
 * RUN THE NPM COMMAND TO BUILD THE STANDALONE OR PLUGINS
 */
async function runNpm(command){
	process.chdir(resolve(__dirname, '../'))
	const child = spawn('npm', ['run', command])
	child.stdout.on('data', d => console.log(d.toString().gray))
	return new Promise(done => child.stdout.on('close', () => done()))
}

async function output(platform, out){

	const nameToPlatform = {
		windows : 'win32',
		macOS : 'darwin'
	}

	const config = {
		overwrite : true,
		arch : 'x64',
		platform : nameToPlatform[platform],
		prune : true,
		out,
		osxSign : false,
	}
	try {
		//build all of the apps
		for (let appName in apps){
			const app = apps[appName]
			await packager(Object.assign({}, config, {
				dir : resolve(__dirname, `../${appName}`),
				name : app.name,
				icon : resolve(__dirname, `./assets/${app.icon}`),
			}))
		}
	} catch (e){
		console.log(e)
	}
}

async function moveFiles(buildDir, outDir, entireDir=false){
	await fs.remove(outDir)
	await fs.ensureDir(outDir)
	const match = resolve(buildDir, './*/*.+(app|exe)')
	const files = await glob(match)
	for (let i = 0; i < files.length; i++){
		const file = files[i]
		const src = entireDir ? dirname(file) : file
		const dst = entireDir ? outDir : resolve(outDir, basename(file))
		await fs.copy(src, dst, {
			overwrite : true,
			errorOnExist : false
		})
	}
	await fs.remove(buildDir)
}

async function toBeSigned(outDir, appFolder, type){
	await fs.remove(outDir)
	await fs.ensureDir(outDir)
	const apps = await glob(`${appFolder}/*.+(app|exe)`)
	// console.log(outDir, appFolder)
	await Promise.all(apps.map(a => fs.copy(a, resolve(outDir, basename(a)))))
	// apps.map()
	await compressAndDelete(outDir, apps, type)
}

async function compressAndDelete(outDir, appFiles, type){

	console.log('COMPRESSSSSS'.green)

	appFiles = appFiles.map(f => resolve(outDir, basename(f)))
	process.chdir(outDir)
	await Promise.all(appFiles.map(appFile => {
		const appName = basename(basename(appFile, '.app'), '.exe')
		console.log(`compressing ${basename(appFile)}`)
		return exec(`zip -vr -y ${appName}.zip ${basename(appFile)} -x "*.DS_Store"`)
	}))
	// //delete all of the originals
	await Promise.all(appFiles.map(f => fs.remove(f)))
}

main()
// toBeSigned(resolve(__dirname, '../dist/to-sign/macOS-ableton-0.0.7'), resolve(__dirname, '../dist/macOS-ableton-0.0.7/apps'))
