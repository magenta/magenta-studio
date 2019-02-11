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

import { app, Menu, ipcMain } from 'electron'
import { Window } from './Window'
import { resolve } from 'path'

/**
 * Main starting point
 */
app.on('ready', () => {
	const main = new Window(INDEX_FILE)
	if (!PRODUCTION){
		main.dev()
	}

	main.on('close', () => app.quit())

	//add the menu
	const template = [{
		submenu : [{
			label : 'Debug',
			accelerator : process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
			click(){
				main.dev()
			}
		},
		{
			label : 'Info',
			click(){
				const popup = new Window(ABOUT_FILE, 520, 450, true)
			}
		},
		{
			role : 'quit'
		}]
	}]

	if (!PRODUCTION){
		template[0].submenu.unshift({
			label : 'Reload',
			accelerator : 'CmdOrCtrl+R',
			click(){
				main.reload()
			}
		})
	}

	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)
})

//handle calls for a popup
ipcMain.on('popup', ({ sender }, data) => {
	makePopup(data)
	ipcMain.once('close-modal', (e, info) => {
		sender.send('close', info)
	})
})

function makePopup(data){
	const popup = new Window('popup.html', 480, 200, true, true)
	popup.webContents.on('did-finish-load', () => {
		popup.webContents.send('setup', data)
	})
}
