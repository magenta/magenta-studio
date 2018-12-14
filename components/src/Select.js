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
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js'

class MagentaSelect extends LitElement {

	static get properties(){
		return {
			label : { type : String },
			valid : { type : Boolean },
			values : { type : String },
			labels : { type : String },
			outlined : { type : Boolean }
		}
	}

	constructor(){
		super()
		this.label = ''
		this.outlined = false
		this.valid = false
	}

	_handleSelect(){
		this.valid = this.selectedIndex !== 0
		this.dispatchEvent(new CustomEvent('change', { 
			detail : {
				value : this.value
			}
		}))
	}

	get selectedIndex(){
		if (this.shadowRoot.querySelector('select')){
			return this.shadowRoot.querySelector('select').selectedIndex
		} else {
			return -1
		}
	}

	set selectedIndex(i){
		if (this.shadowRoot.querySelector('select')){
			this.shadowRoot.querySelector('select').selectedIndex = i
			this._handleSelect()
			this.requestUpdate()
		}
	}

	get value(){
		if (this.shadowRoot.querySelector('select')){
			return this.shadowRoot.querySelector('select').value
		} else {
			return null
		}
	}

	update(changed){
		if (changed.has('values')){
			const values = JSON.parse(this.values)
			if (values.length < this.selectedIndex){
				this.selectedIndex = 0
			}
		}
		super.update(changed)
	}

	render(){

		let values = []
		if (this.values){
			values = JSON.parse(this.values)
		}
		let labels = []
		if (this.labels){
			labels = JSON.parse(this.labels)
		}

		const options = html`
			${values.map((v, i) => html`<option value=${v}>${labels[i] ? labels[i] : v}</option>`)}
		`

		return html`
			${commonStyle}
			<style>
				:host {
					position: relative;
					display: inline-block;
					max-width: 300px;
					--component-height : var(--small-component-height);
					--border-color: white;
				}

				select {
					min-width: 60px;
					padding: 0 calc(var(--component-height)/2);
					width: 100%;
					margin-top: 5px;
					background-color: var(--background-color);
					color: white;
					border-color: var(--border-color);
				}

				select[valid]{
					--border-color : var(--accent-color);
					--shadow-color : var(--accent-color);
					--background-color: var(--accent-color);	
				}

				#carret {
					position: absolute;
					right: calc(var(--component-height)/2);
					top: 50%;
					transform: translate(50%, -50%);
					color: var(--border-color);
					pointer-events: none;
				}

				#carret:before {
					content: "▾";
				}

			</style>
			<select
				?outlined=${this.outlined}
				aria-label=${this.label}
				?valid=${this.valid}
				name="dropdown"
				@change=${this._handleSelect.bind(this)}>
				<option disabled selected>${this.label}</option>
				${options}
			</select>
			<div id="carret" aria-hidden="true"></div>

		`
	}
}
customElements.define('magenta-select', MagentaSelect)
