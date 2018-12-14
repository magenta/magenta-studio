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

customElements.define('magenta-button', class MagentaButton extends LitElement {

	static get properties(){
		return {
			label : { type : String },
			disabled : { type : Boolean },
		}
	}

	constructor(){
		super()
	}

	focus(){
		super.focus()
		this.shadowRoot.querySelector('button').focus()
	}

	render(){
		return html`
			${commonStyle}
			<style>

				:host {
					--component-height: var(--large-component-height);
					width: 100%;
				}

				:host([disabled]){
					pointer-events: none;
				}
				
				button {
					border-color: var(--accent-color);
					--shadow-color: var(--accent-color);
					height: var(--component-height);
					color: white;
					-webkit-appearance: none;
					outline: none;
					background-color: var(--accent-color);
					width: 100%;
					font-size: var(--font-size);
					font-family: var(--font-family);
					cursor: pointer;
				}

				:host([nofill]) button {
					background-color: var(--background-color);
				}

				button:active {
					color: var(--accent-color);
					background-color: white;
					border-color: white;
				}

				button:hover, button:focus {
					// transform: scale(1.05);
				}

				button[disabled]{
					background-color: var(--color-gray);
					border-color: var(--color-gray);
					pointer-events: none;
				}

			</style>
			<button 
				outlined
				?disabled=${this.disabled}>${this.label}</button>
		`
	}
})
