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

const util = require('util')
const exec = util.promisify(require('child_process').exec)
const { resolve } = require('path')
const Application = require('spectron').Application
const colors = require('colors')
const assert = require('assert')

async function main(){

	console.log('ABLETON'.gray)
	await exec('npm run build')
	await test('Interpolate')
	await test('Continue')
	await test('GrooVAE')
	await test('Generate')
	
	console.log('\n\n')

	console.log('STANDALONE'.gray)
	await exec('npm run build:standalone')
	await test('Interpolate')
	await test('Continue')
	await test('GrooVAE')
	await test('Generate')
}

async function test(name){
	const path = resolve(__dirname, `../dist/${name}-darwin-x64/${name}.app/Contents/MacOS/${name}`)
	const app = new Application({ path })

	let testPassed = true

	try {
		await app.start()

		await app.client.waitUntilWindowLoaded()

		const logs = await app.client.getRenderProcessLogs()
		logs.forEach(function(log){
			if (log.level === 'SEVERE' && !log.message.includes('ERR_CONNECTION_REFUSED')){
				console.log(log.message)
				throw new Error(log.message)
			}
		})
		testPassed = true
	} catch (e){
		testPassed = false
		console.log(e)
	}

	await app.stop()

	if (testPassed){
		console.log(`${name} passed`.green)
	} else {
		console.log(`${name} failed`.red)
	}
}

main()
