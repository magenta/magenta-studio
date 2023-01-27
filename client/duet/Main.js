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

import { render, html } from 'lit'
import './style.scss'
import { Model } from './Model';

let serverUrl = "";

let model = undefined;

let mode = "new";

function setStatus(status, error = false) {
    const element = document.querySelector('#generate')
    const controls = document.querySelector('#controls')
    if (status === '') {
        element.setAttribute('label', 'Generate')
        controls.classList.remove('generating')
    } else {
        element.setAttribute('label', status)
        controls.classList.add('generating')
    }
}

async function generate() {
    if (mode === "new") {
        let sequence = await model.newSequence();
        document.querySelector('magenta-midi-file').write(sequence, 'DUET');
        setStatus('');
    } else {
        const inputMidi = await document.querySelector('magenta-midi-file').read()
        let newSequence = await model.continueSequence(inputMidi);
        document.querySelector('magenta-midi-file').write(newSequence, 'DUET');
        setStatus('');
    }
}

function validate() {
    if (controls.classList.contains('generating')) {
        return false
    }
    const valid = document.querySelector('magenta-midi-file').valid
    const button = document.querySelector('#generate')
    if (valid) {
        button.removeAttribute('disabled')
    } else {
        button.setAttribute('disabled', '')
    }
    return valid
}

function handleInputChange(event) {
    serverUrl = event.target.value;
}

function handleConnect() {
    console.log(serverUrl);
    model = new Model(serverUrl);
    model.connect();
}

function setMode(event) {
    mode = event.detail.value;
    const midiFile = document.querySelector('magenta-midi-file');
    const label = mode === "new" ? "Output Location" : "Input Clip";
    midiFile.label = label;
}

export function Duet(parentElement) {
    setTimeout(() => {
        setStatus('')
        validate()
    }, 0);

    render(html`
    <div id="duet">
        <div id="title">
            TRANSFORMER DUET
        </div>
        <div class="plugin-content">
            <div id="controls">
                <div class="plugin-panel">
                    <magenta-input label="Server Address" @change=${handleInputChange}></magenta-input>
                    <magenta-button id="connect" label="Connect" @click=${handleConnect}></magenta-button>
                </div>
                <div class="plugin-panel__type">
                    <magenta-radio-group
                        label="Type"
                        values=${JSON.stringify(['new', 'continue'])}
                        id="mode"
                        @change=${setMode}>
                    </magenta-radio-group>
                </div>
                <div class="plugin-panel">
                    <magenta-midi-file label="Output Location" output @change=${validate} inputs="1"></magenta-midi-file>
                </div>
                <div class="plugin-panel__generate">
                    <magenta-output-text></magenta-output-text>
                    <magenta-button id="generate" label="Initializing..." disabled @click=${generate}></magenta-button>
                </div>
            </div>
        </div>
    </div>
`, parentElement)
}