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

function wait(ms){
	return new Promise(done => setTimeout(done, ms))
}

customElements.define('magenta-snackbar', class MagentaSnackbar extends LitElement {

	static get properties(){
		return {
			message : { type : String },
			error : { type : Boolean },
			whoops : { type : Boolean },
		}
	}

	constructor(){
		super()
		this.error = true
		this.whoops = false
	}

	async firstUpdated(){
		super.firstUpdated()
		await wait(100)
		this.classList.add('entered')
		await wait(5000)
		this.remove()
	}

	async remove(){
		this.classList.remove('entered')
		await wait(1000)
		super.remove()
	}

	render(){
		const whoopsText = html`Whoops! Something went wrong<br><br>`
		const message = html`${this.whoops ? whoopsText : '<br><br>'}${this.message}`
		return html`
			${commonStyle}
			<style>
				:host {
					position: fixed;
					top: 0px;
					left: 0px;
					transition: opacity 0.1s;
					opacity: 0;
					transition-timing-function: ease-out;
					z-index: 100000;
				}
				:host div {
					width: calc(100% - 80px);
					display: block;
					height: auto!important;
					position: fixed;
					-webkit-appearance: none;
					font-size: var(--font-size);
					font-family: var(--font-family);
					padding: 20px 40px 20px;
				}

				:host(.entered) {
					opacity: 1;
				}

				div[error]{
					color: white;
					background-color: var(--color-dark-red);
				}

				#close {
					position: fixed;
					top: 16px;
					right: 20px;
					background-color: transparent;
					outline: none;
					border: none;
					-webkit-appearance: none;
					padding: 0px;
					cursor: pointer;
				}

				svg {
					fill: var(--color-gray);
				}

			</style>
			<div ?error=${this.error}>${message}</div>
			<button id="close"
				@click=${this.remove.bind(this)}
				>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
			</button>
		`
	}
})
