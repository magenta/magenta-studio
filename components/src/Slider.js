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

customElements.define('magenta-slider', class MagentaSlider extends LitElement {

	static get properties(){
		return {
			label : { type : String },
			units : { type : String },
			value : { type : Number },
			min : { type : Number },
			max : { type : Number },
			step : { type : Number },
		}
	}

	constructor(){
		super()
		this.value = '2'
		this.min = '0'
		this.max = '100'
		this.step = '1'
		this.units = ''
	}

	_generateGradient(e){
		this.value = (e && e.target.value) || this.value
		const input = this.shadowRoot.querySelector('input')
		const pos = Math.scale(parseFloat(this.value), parseFloat(this.min), parseFloat(this.max), 0, 1)
		this.dispatchEvent(new CustomEvent('input', {
			bubbles : true, composed : true, 
			detail : {
				value : this.value
			}
		}))
		input.style.backgroundImage = `-webkit-gradient(
				linear,
				left top,
				right top,
				color-stop(${pos}, var(--accent-color)),
				color-stop(${pos}, white)
			)`
	}

	firstUpdated(){
		this._generateGradient()
	}

	render(){
		return html`
			${commonStyle}
			<style>
				:host {
					display: inline-block;
				}

				#top {
					display: block;
					margin-bottom: 5px;
				}

				#value-group {
					float: right;
				}

				label, #value {
					font-weight: bold;
				}

				label, #units, #value {
					color: white;
					font-family: var(--title-font-family);
					font-size: 14px;
				}

				#units {
					margin-left: 4px;
				}

				div {
					margin-top: 10px;
					width: 100%;
					display: flex;
					flex-direction: row;
					align-items: stretch;
				}

				#units {
					color: var(--color-gray);
					${this.units === '' ? 'margin-left: 0' : ''};
				}

				input, input[type="range"]{
					width: 100%;
					border: none;
					-webkit-appearance: none;
					-moz-apperance: none;
					height: 19px;
					border-top: 8px solid var(--background-color);
					border-bottom: 8px solid var(--background-color);
					box-sizing: border-box;
					padding: 0px;
					margin: 0px;
				}

				input[type='range']::-webkit-slider-thumb {
					-webkit-appearance: none !important;
					background-color: white;
					height: 18px;
					width: 18px;
					border-radius: 50%;
				}

				input[type='range']:focus::-webkit-slider-thumb {
					box-shadow: 0 0 1pt 1pt var(--shadow-color);
				}

			</style>
			<div id="top">
				<label for="slider">${this.label}</label>
				<span id="value-group">
					<span id="value">${parseFloat(this.step) < 1 ? parseFloat(this.value).toFixed(1) : this.value}</span>
					<span id="units">${this.units}</span>
				</span>
			</div>
			<input 
				name="slider"
				.min=${this.min}
				.max=${this.max}
				.value=${this.value}
				.step=${this.step}
				@input=${e => this._generateGradient(e)}
				@change=${e => this.value = parseFloat(e.target.value)}
				type="range" >

		`
	}
})
