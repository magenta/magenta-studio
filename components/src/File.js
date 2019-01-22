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

import { LitElement, html } from '@polymer/lit-element'
import { commonStyle } from './InputStyle'
import { exists, writeFile, readFile } from 'fs-extra'
import { midiToSequenceProto, sequenceProtoToMidi } from '@magenta/music'
import { resolve, sep } from 'path'
const { dialog } = require('electron').remote
import { dirname, basename, extname } from 'path'
import dragDrop from 'drag-drop'
import { popup } from './Popup'

class MagentaFile extends LitElement {

	static get properties(){
		return {
			type : { type : String },
			value : { type : String },
			folder : { type : String },
			valid : { type : Boolean },
			output : { type : Boolean },
			defaultvalue : { type : String },
		}
	}

	constructor(){
		super()
		this.valid = false
		this.value = this.defaultvalue
		this.output = false
	}

	firstUpdated(){
		super.firstUpdated()
		dragDrop(this.shadowRoot.querySelector('#filedialog'), (files, pos, fileList, directories) => {
			if (this.output){
				if (directories.length){
					const dir = fileList[0]
					this.value = dir.path
					this.folder = dir.path
				} else {
					this.errorFlash('Output must be a directory')
				}
			} else {
				const file = files[0]
				if (file.type === this.type || file.path.endsWith('.mid') || file.path.endsWith('.midi')){
					this.value = file.path
					this.dispatchEvent(new CustomEvent('file', { detail : { file }, composed : true }))
				} else {
					this.errorFlash('MIDI files only')
				}
			}
		})

		dragDrop(document.body, e => {})
	}

	errorFlash(error){
		const button = this.shadowRoot.querySelector('button')
		button.classList.add('error-flash')
		setTimeout(() => button.classList.remove('error-flash'), 100)
		this._showError(error)
	}

	updated(changed){
		if (changed.has('value') || changed.has('folder')){
			this.valid = this.value !== this.defaultvalue
			if (!this.folder && this.valid){
				this.folder = dirname(this.value)
			}
			this.dispatchEvent(new CustomEvent('change', { 
				detail : { value : this.value }, 
				bubbles : true, composed : true 
			}))
		} 
		if (changed.has('defaultvalue')){
			this.folder = null
			this.value = this.defaultvalue
		}
		super.updated(changed)
	}

	get outputPath(){
		if (this.valid){
			if (!this.folder){
				this.folder = dirname(this.value)
			}
			return this.folder
		}
	}

	async write(sequences, prefix){
		if (this.folder){
			const inputName = basename(this.value, extname(this.value))
			const files = sequences.map((s, i) => resolve(this.folder, this.output ? `${prefix} ${i}.mid` : `${prefix} ${i} - ${inputName}.mid`))
			const filesExist = await Promise.all(files.map(f => exists(f)))
			const anyExists = filesExist.some(e => e)

			//if the files should be overwritten
			let writeFiles = true
			if (anyExists){
				const existingFiles = files.filter((f, i) => filesExist[i])
				const fileNames = existingFiles.map(f => basename(f))
				writeFiles = await this._overwriteFile(fileNames)
			}

			if (writeFiles){
				sequences.forEach(seq => seq.tempos[0].time = 0)
				sequences.forEach(seq => seq.tempos[0].qpm = 120)
				const midiData = sequences.map(s => sequenceProtoToMidi(s))
				await Promise.all(midiData.map((midi, i) => {
					const file = files[i]
					return writeFile(file, midi, 'binary')
				}))
			}
		} else {
			this._showError('No output folder selected.')
		}
	}

	_showError(e){
		const snackbar = document.createElement('magenta-snackbar')
		snackbar.setAttribute('message', e)
		document.body.appendChild(snackbar)
	}

	async read(){
		const buffer = await readFile(this.value, 'binary')
		return midiToSequenceProto(buffer)
	}

	async _overwriteFile(paths){
		const maxLen = 6
		if (paths.length > maxLen){
			const len = paths.length
			paths = paths.slice(0, maxLen)
			paths[maxLen-1] = `${len-(maxLen-1)} more...`
		}
		const response = await popup({
			title : `Overwrite file${paths.length > 1 ? 's' : ''}?`,
			body : `
				These files will be saved over:
				<ul>
					${paths.map(p => `<li>${p}</li>`).join(' ')}
				</ul>
			`
		})
		return response === 'ok'
	}

	async _openFile(){
		if (this.output){
			await this.chooseOutput()
			if (this.folder){
				this.value = this.folder
			}
		} else {
			dialog.showOpenDialog({ 
				title : 'Input MIDI file',
				properties : ['openFile'], 
				filters : [{ name : 'Midi Files', extensions : ['mid', 'midi'] }] 
			}, files => {
				if (files){
					this.value = files[0]
				}
			})
		}
	}

	async chooseOutput(){


		const dir = await new Promise(done => {
			dialog.showOpenDialog({
				title : 'Select output folder',
				message : 'Choose an output directory',
				properties : ['openDirectory', 'createDirectory', 'promptToCreate'], 
				defaultPath : dirname(this.value)
			}, folder => {
				if (folder){
					done(folder[0])
				} else {
					done()
				}
			})
		})

		if (this.output && dir){
			this.value = dir
			this.folder = dir
		} else if (dir){
			this.folder = dir
		} 
	}

	render(){

		return html`
			${commonStyle}
			<style>

				:host {
					--component-height: var(--large-component-height);
					--button-size: var(--component-height);
					--margin-right: 10px;
					--border-color: white;
					width: 80%;
					margin: 0 auto;
					min-width: 260px;
					display: block;
					position: relative;
				}

				:host([small]) {
					--component-height: var(--medium-component-height);
				}

				@keyframes flash {
					0%   { 
						
					}
					100% { 
						border-color: inherit; 
						background-color: inherit; 
						color: white; 
					}
				}

				div {
					margin-top: 18px;
					position: relative;
				}

				.error-flash {
					--flash-color: var(--color-red);
					border-color: var(--flash-color)!important; 
					background-color: var(--bg-flash-color)!important; 
					color: var(--flash-color)!important; 
				}

				#filedialog {
					position: relative;
					text-align: center;
					display: inline-block;
					text-overflow: ellipsis;
					padding: 0 40px 0 40px;
					cursor: pointer;
					background-color: var(--background-color);
					border-color: var(--border-color);
					color: var(--border-color);
					transition: border-width 0.3s;
					font-size: var(--font-size);
					font-family: var(--font-family);
					white-space: nowrap;
					overflow: hidden;
					width: 100%;
					transition: all 0.1s;
				}

				#filedialog.drag {
					background-color: var(--color-light-gray);
				}

				#filedialog[valid]{
					border-color: var(--accent-color);	
					background-color: var(--accent-color);	
				}

				#filedialog[valid]:focus {
					--shadow-color: var(--accent-color);
				}

				#clear {
					position: absolute;
					right: 12px;
					top: 50%;
					background-color: transparent;
					border: none;
					outline: none;
					padding: 0;
					transform: translate(0, -50%);
				}

				#clear svg {
					fill: var(--color-gray);
				}

				#clear:hover svg {
					fill: var(--color-hover);
				}

				#clear:focus svg {
					fill: var(--color-gray);
				}

				#clear[disabled] {
					display: none;
				}

				#output {
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					color: white;
					left: 0px;
					width: 100%;
					text-align: center;
					display: block;
					margin-top: 10px;
					font-family: var(--font-family);
					font-size: 0.8em;
					color: var(--color-gray);
				}

				#output span {
					cursor: pointer;
					color: white;
					text-decoration: underline;
				}
				
			</style>
			<div>
				<button
					outlined
					id="filedialog"
					?valid=${this.valid}
					@click=${this._openFile.bind(this)}
					class="bordered"
					>${this.value && this.value.replace(process.env.HOME, '~')}</button>
				<button id="clear" 
					@click=${() => this.value = this.defaultvalue}
					?disabled=${this.value === this.defaultvalue}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
				</button>
			</div>
		`
	}
}
customElements.define('magenta-file', MagentaFile)
