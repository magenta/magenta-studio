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
import './File'
import './Select'
import './Tabs'
import './Ableton'

class OutputText extends LitElement {

	static get properties(){
		return {
			show : { type : Boolean },
		}
	}

	connectedCallback(){
		super.connectedCallback()
		this.magentaMidiFile = document.querySelector('magenta-midi-file')
		this.variations = document.querySelector('#variations')

		if (this.variations){
			this.variations.addEventListener('input', () => this.requestUpdate())
		}
		this.magentaMidiFile.addEventListener('change', () => this.requestUpdate())
		this.magentaMidiFile.addEventListener('valid', ({ detail }) => {
			this.show = detail.valid
		})
	}

	_choosePath(){
		if (!ABLETON){
			this.magentaMidiFile.chooseOutput()
		}
	}

	render(){
		const valid = this.magentaMidiFile.valid
		let pathString = ''
		const variations = this.variations ? parseInt(this.variations.value) : ''
		let outputType = ''
		if (valid){
			const path = this.magentaMidiFile.outputPath
			if (ABLETON){
				const startIndex = path+1
				if (variations > 1){
					pathString = `Clip Slots ${startIndex}-${startIndex+variations-1}`
				} else {
					pathString = `Clip Slot ${startIndex}`
				}
				outputType = variations > 1 ? 'clips' : 'clip'
			} else {
				pathString = `${path && path.replace(process.env.HOME, '~')}`
				outputType = variations > 1 ? 'files' : 'file'
			}
		}
		return html`
			<style>
				:host {
					word-spacing: 0.1em;
					font-family: var(--font-family);
					font-size : var(--font-size);
					color: var(--color-gray);
					position: fixed;
					bottom: calc(var(--large-component-height) + 25px);
					width: 80%;
					left: 10%;
				}

				div {
					text-align: center;
					font-size: 0.95em;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					opacity: 1;
					transition: opacity 0.1s;
				}

				div span {
					color: white;
				}

				div:not([visible]){
					opacity: 0;
				}
				span[clickable]{
					cursor: pointer;
					text-decoration: underline;
				}
			</style>
			<div ?visible=${this.show}>
				Output <span>${variations}</span> 
				${outputType}
				to <span 
					?clickable=${!ABLETON}
					@click=${this._choosePath.bind(this)}>${pathString}</span>
			</div>
		`
	}
}
customElements.define('magenta-output-text', OutputText)
