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

import { html } from '@polymer/lit-element'

export const inputStyle = html`
	<style>
		input, select, #filedialog, .bordered {
			border: 2px solid var(--border-color);
			background-color: var(--background-color);
			border-radius: var(--border-radius);
			box-sizing: border-box;
			height: var(--component-height);
			line-height: var(--component-height);
			color: var(--color-gray);
			font-family: var(--font-family);
			outline: none;
			-webkit-appearance: none;
			font-size: var(--font-size);
			padding: 10px;
			-webkit-app-region: no-drag;
		}

		input[disabled], select[disabled] {
			opacity: 0.25;
			pointer-events: none;
		}

		input:focus, select:focus {
			--border-color: var(--color-focused);
			color: var(--color-focused);
		}

		input:hover, select:hover {
			--border-color: var(--color-hover);
			color: var(--color-hover);
		}



	</style>
`
export const commonStyle = html`
	<style>

		label {
			font-weight: bold;
			font-family: var(--title-font-family);
			font-size: var(--font-size);
			color: white;
		}

		button, input, select {
			outline-width: 0px;
			-webkit-appearance: none;
			-webkit-app-region: no-drag;
			cursor: pointer;
			transition: box-shadow 0.2s;
			box-shadow: 0 0 0 0 white;
		}

		button:focus, select:focus {
			box-shadow: 0 0 1pt 1pt var(--shadow-color);
		}

		[outlined] {
			height : var(--component-height);
			border-radius : calc(var(--component-height)/2);
			border-width: 2px;
			border-style: solid;
			box-sizing: border-box;
		}

		[disabled] {
			opacity: 0.25;
			pointer-events: none;
		}
	</style>
`
