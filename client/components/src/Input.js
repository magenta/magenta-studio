/**
 * @license
 * Copyright 2023 Google Inc. All Rights Reserved.
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
import { inputStyle, commonStyle } from './InputStyle'

customElements.define('magenta-input', class MagentaInput extends LitElement {
    static get properties() {
        return {
            value: { type: String },
            label: { type: String },
            placeholder: { type: String }
        }
    }

    constructor() {
        super()
    }

    handleInput(event) {
        this.value = event.target.value;
        this.dispatchEvent(new CustomEvent("change", { value: this.value }))
    }

    focus() {
        super.focus();
        this.shadowRoot.querySelector('input').focus()
    }

    render() {
        return html`
            ${commonStyle}
            ${inputStyle}
            <style>
                :host {
                    position: relative;
					display: inline-block;
					max-width: 300px;
					--component-height : var(--small-component-height);
					--border-color: white;
                }

                label {
                    display: inline-block;
                    margin-bottom: 5px;
                }

                input[type="text"] {
                    min-width: 60px;
                    cursor: text;
                    background-color: var(--background-color);
					color: white;
                    border-color: var(--border-color);
                    padding: 0 calc(var(--component-height)/2);
                    margin-bottom: 10px;
                    height: var(--component-height);
                    display: inline-block;
                    width: 100%;
                }

            </style>
            <label for="magenta-input">${this.label}</label>
            <input outlined id="magenta-input" type="text" @input=${this.handleInput} value=${this.value} />
        `
    }
})