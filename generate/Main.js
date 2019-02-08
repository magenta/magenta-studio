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

import { render, html } from 'lit-html'
import { Model } from './Model'
import './style.scss'

const models = {
	drums : new Model(true),
	melody : new Model(false),
}

const initialized = Promise.all([models.drums.load(), models.melody.load()])
initialized.then(() => {
	setStatus('')
})

async function generate(){

	if (!validate()){
		return
	}
	setStatus('Generating...')
	//get all the attributes
	const mode = document.querySelector('#mode').value
	const variations = document.querySelector('#variations').value
	const temp = document.querySelector('#temperature').value
	try {
		const output = await models[mode].sample(variations, temp)
		await document.querySelector('magenta-midi-file').write(output, 'GENERATE')
	} catch (e){
		const snackbar = document.createElement('magenta-snackbar')
		snackbar.setAttribute('message', e)
		snackbar.setAttribute('error', '')			
		snackbar.setAttribute('whoops', '')			
		document.body.appendChild(snackbar)
		setStatus('')
		throw e
	}
	setStatus('')
}

function validate(){
	if (controls.classList.contains('generating')){
		return false
	}
	const valid = document.querySelector('magenta-midi-file').valid
	const button = document.querySelector('#generate')
	if (valid){
		button.removeAttribute('disabled')
	} else {
		button.setAttribute('disabled', '')
	}
	return valid
}

render(html`
	<div id="title" class="${ANIMATE ? 'animate' : ''}">
		<span>
			GENERATE
		</span> 4 BARS
	</div>
	<magenta-close-button></magenta-close-button>
	<div id="controls">
		<magenta-radio-group
				values=${JSON.stringify(['drums', 'melody'])}
				id="mode">
			</magenta-radio-group>
		<magenta-midi-file label="Output Location" output @change=${validate} inputs="1"></magenta-midi-file>
		<magenta-slider id="variations" value="8" min="1" max="16" label="Variations"></magenta-slider>
		<magenta-slider id="temperature" value="1" min="0" max="2" step="0.1" label="Temperature"></magenta-slider>
	</div>
	<magenta-output-text></magenta-output-text>
	<magenta-button id="generate" label="Initializing..." disabled @click=${generate}></magenta-button>
`, document.body)

function setStatus(status, error=false){
	const element = document.querySelector('magenta-button')
	const controls = document.querySelector('#controls')
	if (status === ''){
		element.setAttribute('label', 'Generate')
		controls.classList.remove('generating')
	} else {
		element.setAttribute('label', status)
		controls.classList.add('generating')
	}
}
