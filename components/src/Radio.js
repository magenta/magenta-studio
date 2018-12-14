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

/**
 * The Tab Group
 */
customElements.define('magenta-radio-group', class MagentaRadio extends LitElement {

	static get properties(){
		return {
			values : { type : String },
			selectedIndex : { type : Number },
			disabled : { type : Boolean }
		}
	}

	constructor(){
		super()
		this.selectedIndex = 0
	}

	updated(changed){
		if (changed.has('selectedIndex')){
			this.dispatchEvent(new CustomEvent('change', {
				details : {
					selectedIndex : this.selectedIndex,
					value : this.value
				},
				bubbles : true,
				composed : true
			}))
		}
	}

	get value(){
		return JSON.parse(this.values)[this.selectedIndex]
	}

	render(){
		const buttons = JSON.parse(this.values).map((label, i) => html`
			<button 
				outlined 
				@click=${() => this.selectedIndex = i}
				?selected=${i === this.selectedIndex}>${label}</button>
		`)
		return html`
			${commonStyle}
			<style>
				#container {
					--component-height : var(--small-component-height);
					height: var(--component-height);
					display: flex;
					align-content: space-between;
				}

				button {
					border-color: var(--accent-color);
					--shadow-color: var(--accent-color);
					background-color: var(--barkground-color);
					height: var(--component-height);
					text-align: center;
					flex-grow: 1;
					align-content: space-between;
					text-transform: capitalize;
					margin-right: var(--margin);
					color: white;
				}

				button:last-child{
					margin-right: 0;
				}

				[selected] {
					background-color: var(--accent-color);
				}
			</style>
			<div id="container">
				${buttons}
			</div>
		`
	}
})
