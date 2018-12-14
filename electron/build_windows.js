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
const electronInstaller = require('electron-winstaller')
const { resolve, basename, dirname } = require('path')
const glob = require('glob-promise')
const fs = require('fs-extra')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const { spawn } = require('child_process')
const colors = require('colors')
const package = require('../package.json')


// const platform = ['darwin', 'win32']
// const platform = ['darwin']

async function main(){

	const { name, version } = package
	const outName = `${name}-${version}`

	console.log(outName.magenta)
	console.log('\n')

	const platform = 'windows'
	const buildDir = resolve(__dirname, '../dist', platform)

	/**
	 * ABLETON
	 */
	/*console.log('BUILDING ABLETON'.green)
	await runNpm('webpack:build')

	console.log('\n')

	console.log('BUNDLE ABLETON'.green)
	const buildDir = resolve(__dirname, '../dist', platform)
	const maxDir = resolve(__dirname, '../max/.apps')
	await output('darwin', 'magenta_logo', buildDir)
	await moveFiles(buildDir, maxDir)
	await fs.copy(resolve(__dirname, '../max/'), resolve(__dirname, '../dist', `${outName}-ableton-${platform}`))

	console.log('\n')*/

	/**
	 * STANDALONE
	 */
	console.log('BUILDING STANDALONE'.green)
	// await runNpm('webpack:standalone')

	console.log('\n')

	console.log('BUNDLE STANDALONE'.green)
	const standaloneOut = resolve(__dirname, '../dist', `${outName}-standalone-${platform}`)
	//await output(platform, undefined, buildDir)

	await electronInstaller.createWindowsInstaller({
		appDirectory: resolve(__dirname, '../dist/windows/Continue-win32-x64'),
    	outputDirectory: resolve(__dirname, '../dist/test'),
    	authors: 'Magenta',
    	setupExe : 'Continue',
    	exe: 'Continue.exe',
    	iconUrl: resolve(__dirname, './assets/Continue_icon.png'),
	})
	// await moveFiles(buildDir, standaloneOut)

	// console.log('COMPRESSSSSS'.green)
	//compress the max dir
	// await toBeSigned()
}

async function runNpm(command){
	process.chdir(resolve(__dirname, '../'));
	const child = spawn('npm', ['run', command])
	child.stdout.on('data', d => console.log(d.toString().gray))
	return new Promise(done => child.stdout.on('close', () => done()))
}

async function output(platform, icon, out){
	const config = {
		overwrite : true,
		arch : 'x64',
		platform : 'win32',
		prune : true,
		out,
		osxSign : false,
	}
	try {
		await packager(Object.assign({}, config, {
			dir : resolve(__dirname, '../continue'),
			name : 'Continue',
			// icon : resolve(__dirname, './assets/Continue_icon'),
		}))
		await packager(Object.assign({}, config, {
			dir : resolve(__dirname, '../groovae'),
			name : 'GrooVAE',
			// icon : resolve(__dirname, './assets/GrooVAE_icon'),
		}))
		await packager(Object.assign({}, config, {
			dir : resolve(__dirname, '../interpolate'),
			name : 'Interpolate',
			// icon : resolve(__dirname, './assets/Interpolate_icon'),
		}))
		await packager(Object.assign({}, config, {
			dir : resolve(__dirname, '../generate'),
			name : 'Generate',
			// icon : resolve(__dirname, './assets/Generate_icon'),
		}))
	} catch (e){
		console.log(e)
	}
}


async function moveFiles(buildDir, outDir){
	await fs.remove(outDir)
	await fs.ensureDir(outDir)
	const match = resolve(buildDir, './*/*.app')
	const files = await glob(match)
	await Promise.all(files.map(f => {
		const src = f
		const dst = resolve(outDir, basename(f))
		return fs.rename(src, dst)
	}))
	await fs.remove(buildDir)
}

async function toBeSigned(){
	const outDir = resolve(__dirname, `../dist/to-sign-${package.version}`)
	if (await fs.exists(outDir)){
		await fs.remove(outDir)
	}
	await fs.ensureDir(outDir)
	const standaloneApps = await glob(resolve(__dirname, '../dist/*/*.app'))
	const abletonApps = await glob(resolve(__dirname, '../dist/*/.apps/*.app'))
	await Promise.all(standaloneApps.map(a => fs.copy(a, resolve(outDir, 'standalone', basename(a)))))
	await Promise.all(abletonApps.map(a => fs.copy(a, resolve(outDir, 'ableton', basename(a)))))
	//get all of the files in the standalone
	await compressAndDelete(outDir, 'standalone')
	await compressAndDelete(outDir, 'ableton')
}

async function compressAndDelete(outDir, type){
	const appDir = resolve(outDir, type)
	process.chdir(appDir)
	const appFiles = await glob(resolve(appDir, '*.app'))
	await Promise.all(appFiles.map(appFile => {
		console.log(`compressing ${basename(appFile)}`)
		return exec(`zip -r -y ${basename(appFile, '.app')}.zip ${basename(appFile)}`)
	}))
	//delete all of them
	await Promise.all(appFiles.map(f => fs.remove(f)))
}

main()
// toBeSigned()
