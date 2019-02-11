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

const max = require('max-api')
const opn = require('opn')
const fs = require('fs-extra')
const { resolve } = require('path')

const appNames = ['continue', 'interpolate', 'generate', 'groove', 'drumify']

max.addHandler('open', async app => {

	if (appNames.includes(app)){
		const appDir = resolve(__dirname, '../apps')
		const apps = await fs.readdir(appDir)
		const executable = apps.find(a => a.toLowerCase().includes(app))

		let executablePath = resolve(appDir, executable)

		//for windows, there's an exe inside the dir with the same name
		if (await fs.exists(resolve(executablePath, `${executable}.exe`))){
			executablePath = resolve(executablePath, `${executable}.exe`)
		}

		await opn(executablePath)
		//resolves when the app is closed
		max.outlet(app, 0)
	}
})

/* max.addHandler('close', app => {

}) */

appNames.forEach(a => max.outlet(a, 0))
