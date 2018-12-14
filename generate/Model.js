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

import { MusicVAE, sequences } from '@magenta/music'
const { quantizeNoteSequence, unquantizeSequence, clone } = sequences
import { resolve } from 'path'

const modelPath = PRODUCTION ? `${process.resourcesPath}/app/` : '.'

export class Model {
	constructor(drums=false){
		//const drumUrl = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/drums_4bar_med_lokl_q2'
		//const melodyUrl = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_med_lokl_q2'
		const drumUrl = resolve(modelPath, 'models/drums_4bar_med_lokl')
		const melodyUrl = resolve(modelPath, 'models/mel_4bar_med_lokl')
		this.model = new MusicVAE(drums ? drumUrl : melodyUrl)
	}

	async load(){
		try {
			await this.model.initialize()
		} catch (e){
			const snackbar = document.createElement('magenta-snackbar')
			document.body.appendChild(snackbar)
		}
	}

	async sample(count, temp=1){
		let outSequences = await this.model.sample(count, temp)
		outSequences = outSequences.map(s => unquantizeSequence(s, 60))
		outSequences.forEach(seq => seq.notes.forEach(n => n.velocity = 100))
		return outSequences
	}
}

