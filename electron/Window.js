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

import { BrowserWindow } from 'electron'
import { EventEmitter } from 'events'
import { resolve } from 'path'

const windows = []

export class Window extends EventEmitter {
	constructor(file, width=WIDTH, height=HEIGHT, frame=false, modal=false){
		super()

		const buildPath = PRODUCTION ? `${process.resourcesPath}/app/` : '.'

		let parent = undefined
		if (modal){	
			parent = windows[0]
		}

		this.window = new BrowserWindow({ 
			width, height, 
			show : false, 
			frame,
			titleBarStyle : frame || !ABLETON ? 'default' : undefined,
			modal,
			parent,
			resizable : false,
			// skipTaskbar : true,
			fullscreenable : false,
			backgroundThrottling : false,
			webPreferences : {
				nodeIntegration : true,
			}
		})

		//load the window
		this.window.loadFile(resolve(buildPath, 'build', file))

		this.window.on('closed', () => {
			this.emit('close')
			const index = windows.indexOf(this.window)
			if (index !== -1){
				windows.splice(index, 1)
			}
			
		})

		windows.push(this.window)

		this.window.once('ready-to-show', () => {
			this.window.show()
		})
	}

	show(){
		this.window.show()
	}

	hide(){
		this.window.hide()
	}

	dev(){
		this.window.webContents.openDevTools({ mode : 'detach' })
	}

	reload(){
		this.window.reload()	
	}

	get webContents(){
		return this.window.webContents
	}
}
