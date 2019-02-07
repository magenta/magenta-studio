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
		// const melodyUrl = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_med_q2'
		// const drumsUrl = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/drums_4bar_med_q2'
		const drumUrl = resolve(modelPath, 'models/drums_4bar_med')
		const melodyUrl = resolve(modelPath, 'models/mel_4bar_med')
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

	validateSequence(seqA, seqB){
		const maxBeats = 4 * 16
		//make sure they're the same number of measures
		const len = Math.min(seqA.totalQuantizedSteps, seqB.totalQuantizedSteps, maxBeats)
		this.trim(seqA, len)
		this.trim(seqB, len)
	}

	trim(sequence, beats){
		sequence.totalQuantizedSteps = beats
		sequence.totalTime = beats * 0.25
		sequence.notes = sequence.notes.filter(n => n.quantizedEndStep < beats)
		console.log(sequence)
	}

	trimOutput(inSequence, outSequences){
		outSequences.forEach(seq => {
			this.trim(seq, inSequence.totalQuantizedSteps)
		})
	}

	setVelocities(sequences){
		sequences.forEach(seq => {
			seq.notes.forEach(n => n.velocity = 100)
		})
	}

	async predict(inputSequenceA, inputSequenceB, steps=4, temp=1){
		const quarterNoteSubdiv = 4
		inputSequenceA = quantizeNoteSequence(inputSequenceA, quarterNoteSubdiv)
		inputSequenceB = quantizeNoteSequence(inputSequenceB, quarterNoteSubdiv)
		this.validateSequence(inputSequenceA, inputSequenceB)
		let outSequences = await this.model.interpolate([inputSequenceA, inputSequenceB], steps, temp)
		outSequences = outSequences.map(s => unquantizeSequence(s, inputSequenceA.tempos[0].qpm))
		this.trimOutput(inputSequenceA, outSequences)
		this.setVelocities(outSequences)
		return outSequences
	}

	concat(...args){
		if (args.length === 2){
			const [seqA, seqB] = args
			const outputSequence = clone(seqA)
			seqB.notes.forEach(note => {
				const clonedNote = Object.assign({}, note)
				clonedNote.startTime += outputSequence.totalQuantizedSteps/4
				clonedNote.endTime += outputSequence.totalQuantizedSteps/4
				clonedNote.quantizedStartStep += seqA.totalQuantizedSteps
				clonedNote.quantizedEndStep += seqA.totalQuantizedSteps
				outputSequence.notes.push(clonedNote)
			})
			outputSequence.totalQuantizedSteps = seqA.totalQuantizedSteps + seqB.totalQuantizedSteps
			outputSequence.totalTime = outputSequence.totalQuantizedSteps / 4
			return outputSequence
		} else if (args.length > 2){
			//concat the last two
			//get the first arg
			const first = args.shift()
			return this.concat(first, this.concat(...args))
		} else {
			throw new Error('concat requires at least two arrays')
		}
	}

	duplicate(seqs, repeats){
		const outSeq = []
		seqs.forEach(s => {
			for (let i = 0; i < repeats; i++){
				outSeq.push(s)
			}
		})
		return outSeq
	}
}

