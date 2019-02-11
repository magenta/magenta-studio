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
import { commonStyle } from './InputStyle'

class CloseButton extends LitElement {

	render(){
		const closeButton = html`
			${commonStyle}
			<style>
				:host {
					display: block;
					position: fixed;
					top: 10px;
					left: 10px;
				}

				svg {
					fill: var(--color-gray);
				}

				button:focus svg, button:active svg {
					fill: white;
				}

				button:focus {
					outline: none;
					border: none;
					box-shadow: none;
				}

				button {
					background-color: transparent;
					outline: none;
					border: none;
					padding: 0px;
				}

			</style>
			<button @click=${() => window.close()}>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
					<path d="M0 0h24v24H0z" fill="none"/>
				</svg>
			</button>
		`
    return closeButton
	}
}
customElements.define('magenta-close-button', CloseButton)
