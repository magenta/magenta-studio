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

import { MusicRNN, data, tf, sequences } from '@magenta/music'
const { quantizeNoteSequence, unquantizeSequence, clone } = sequences
import { resolve } from 'path'

// import '@tensorflow/tfjs-node'

// tf.setBackend('tensorflow')

const modelPath = PRODUCTION ? `${process.resourcesPath}/app` : '.'

export class Model {
	constructor(drums=false){
		// const drumUrl = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/drum_kit_rnn'
		// const melodyUrl = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn'
		const drumUrl = resolve(modelPath, 'models/drum_kit_rnn')
		const melodyUrl = resolve(modelPath, 'models/melody_rnn')
		this.model = new MusicRNN(drums ? drumUrl : melodyUrl)
		this.tempo = 120
		this.drums = drums
	}

	async load(){
		try {
			await this.model.initialize()
		} catch (e){
			const snackbar = document.createElement('magenta-snackbar')
			document.body.appendChild(snackbar)
		}
	}

	async predict(inSequence, steps=16, temp=1, variations=1){
		const returnSequences = []
		for (let i = 0; i < variations; i++){
			let continuation = await this.model.continueSequence(quantizeNoteSequence(inSequence, 4), steps, temp)
			continuation = unquantizeSequence(continuation, inSequence.tempos[0].qpm)
			continuation = this.concat(inSequence, continuation)
			continuation.notes.forEach(n => n.velocity = 100)
			returnSequences.push(continuation)
		}
		return returnSequences
	}

	concat(seqA, seqB){
		const outputSequence = clone(seqA)
		seqB.notes.forEach(note => {
			note.startTime += seqA.totalTime
			note.endTime += seqA.totalTime
			note.quantizedStartStep += seqA.totalQuantizedSteps
			note.quantizedEndStep += seqA.totalQuantizedSteps
			outputSequence.notes.push(note)
		})
		outputSequence.totalTime += seqB.totalTime
		outputSequence.totalQuantizedSteps += seqB.totalQuantizedSteps
		return outputSequence

	}
}

