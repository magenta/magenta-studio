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
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js'
import { commonStyle } from './InputStyle'

/**
 * The Tab Group
 */
customElements.define('magenta-tabs-group', class MagentaTabs extends LitElement {

	static get properties(){
		return {
			label : { type : String },
			selectedIndex : { type : Number },
			disabled : { type : Boolean }
		}
	}

	constructor(){
		super()
	}

	connectedCallback(){
		super.connectedCallback()
		this._nodesObserver = new FlattenedNodesObserver(this, () => this.requestUpdate())
	}

	disconnectedCallback(){
		this._nodesObserver.disconnect()
		super.disconnectedCallback()
	}

	updated(props){
		super.updated(props)
		if (props.has('selectedIndex')){
			this.children[this.selectedIndex].dispatchEvent(new CustomEvent('show'))
			this.dispatchEvent(new CustomEvent('change', {
				detail : { selectedIndex : this.selectedIndex },
				bubbles : true, composed : true
			}))
		}
	}

	render(){
		Array.from(this.children).forEach((tab, index) => {
			if (index !== this.selectedIndex){
				tab.style.display = 'none'
			} else {
				tab.style.display = 'block'
			}
		})

		const tabs = html`
			<div id="tabs">${Array.from(this.children).map((c, i, array) => html`
				<button class="tab ${this.selectedIndex === i ? 'selected' : ''}"
					@click=${() => this.selectedIndex = i}>${c.label}</button>
			`)}</div>`
		return html`
			${commonStyle}
			<style>
				#container {
					display: block;
					font-size: var(--font-size);
					font-family: var(--title-font-family);
				}
				label, #tabs {
					display: inline-block;
				}

				label {
					margin: 0 10px 0 0;
				}
				#tabs {
					top: 1px;
					transition: opacity 0.2s;
					position: relative;
				}

				:host([disabled]) #tabs {
					pointer-events: none;
					opacity: 0;
				}

				magenta-tab[disabled]{
					opacity: 0.25;
					pointer-events: none;
				}

				#tabs, .tab {
					font-family: var(--title-font-family);
					font-size: var(--font-size);
					color: var(--color-gray);
				}
				.tab {
					-webkit-appearance: none;
					background-color: transparent;
					border: none;
					padding: 0 2px;
					outline: none;
					box-shadow: none!important;
				}

				.tab:nth-child(1){
					padding-right: 7px;
					border-right: 1px solid var(--color-gray);

				}

				#tabs .tab.selected {
					color: white;
					// text-decoration: underline;
					// border-bottom: 1px solid var(--color-gray);
				}
				#tabs .tab:hover, #tabs .tab:focus {
					// color: var(--color-focused);
					cursor: pointer;
				}
				.visible {
					display: block;
				}
				.invisible {
					display: none;
				}
			</style>
			<div id="container">
				<label aria-label=${this.label}>${this.label}</label>
				${this.disabled? html`` : tabs}
				<div id="content">
					<slot></slot>
				</div>
			</div>
		`
	}
})

/**
 * The Tab
 */
customElements.define('magenta-tab', class MagentaTab extends LitElement {
	static get properties(){
		return {
			label : { type : String },
			visible : { type : Boolean },
			disabled : { type : Boolean }
		}
	}

	constructor(){
		super()
	}

	render(){
		return html`
			<style>
				:host([disabled]){
					opacity: 0.25;
					pointer-events: none;
				}
			</style>
			<slot></slot>
		`
	}
})
