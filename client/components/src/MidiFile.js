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

import { LitElement, html } from 'lit'
import { commonStyle } from './InputStyle'
// import './File'
import './Select'
import './Tabs'
import './Ableton'

class MagentaFile extends LitElement {

	static get properties(){
		return {
			label : { type : String },
			connected : { type : Boolean },
			valid : { type : Boolean },
			inputs : { type : Number },
			output : { type : Boolean },
		}
	}

	constructor(){
		super()
		this.label = ''
		this.valid = false,
		this.inputs = 1
		this.output = false
	}

	async read(){
		return await this.shadowRoot.querySelector('magenta-ableton-file').read()
	}

	async write(sequence, prefix='EXT'){
		await this.shadowRoot.querySelector('magenta-ableton-file').write(sequence, prefix)
	}

	_testValid(){
		this.valid = this.shadowRoot.querySelector('magenta-ableton-file').valid
	}

	get outputPath(){
		return this.shadowRoot.querySelector('magenta-ableton-file').outputPath
	}

	update(changed){
		if (changed.has('valid')){
			this.dispatchEvent(new CustomEvent('valid', {
				detail : { valid : this.valid },
				bubbles : true, composed : true
			}))
		}
		super.update(changed)
	}

	render(){
		let inner = html`
			<magenta-ableton-file 
				?output=${this.output}
				numclips=${this.inputs.toString()}
				@change=${this._testValid.bind(this)}
				@disconnected=${() => this.connected = false}
				@connected=${() => this.connected = true}>
			</magenta-ableton-file>`
		return html`
			${commonStyle}
			<style>
				:host {
					padding-bottom: 5px;

				}

				magenta-file{
					display: block;
				}

			</style>
			<label>${this.label}</label>
			${inner}
		`
	}
}
customElements.define('magenta-midi-file', MagentaFile)
