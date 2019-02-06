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
import { resolve } from 'f'

const modelPath = PRODUCTION ? `${process.resourcesPath}/app/` : '.'

export class Model {
	constructor(){
		const models = [
			resolve(modelPath, 'model/groovae_tap2drum_1bar'),
			resolve(modelPath, 'model/groovae_tap2drum_2bar'),
			resolve(modelPath, 'model/groovae_tap2drum_3bar'),
			resolve(modelPath, 'model/groovae_tap2drum_4bar')
		]
		this.models = models.map(url => new MusicVAE(url))
	}

	async load(){
		try {
			await this.model.initialize()
		} catch (e){
			const snackbar = document.createElement('magenta-snackbar')
			snackbar.setAttribute('message', e)
			document.body.appendChild(snackbar)
		}
	}

	async todrums(inSeq, temp=1){
		inSeq = quantizeNoteSequence(inSeq, 4)
		//split up by measure
		const inputSeqs = []
		const grouping = 16 * 4
		const outputs = []
		for (let startOffset = 0; startOffset < inSeq.totalQuantizedSteps; startOffset+=grouping){
			const duration = Math.min(inSeq.totalQuantizedSteps - startOffset, grouping)
			const measures = Math.ceil(duration / 16)
			const measure = clone(inSeq)
			const endOffset = startOffset + grouping
			measure.notes = inSeq.notes
				.map(n => Object.assign({}, n))
				.filter(n => startOffset <= n.quantizedStartStep && n.quantizedStartStep < endOffset)
				.map(n => {
					n.quantizedStartStep -= startOffset
					n.quantizedEndStep -= startOffset
					return n
				})
			const modelIndex = measures-1
			const z = await this.models[modelIndex].encode([measure])
			const output = await this.models[modelIndex].decode(z, temp)
			z.dispose()
			outputs.push(output[0])
		}
		const reconstruction = this.concat(...outputs)
		reconstruction.notes.forEach(n => {
			n.startTime *= 2
			n.endTime *= 2
		})
		reconstruction.totalTime *= 2
		return reconstruction
	}

	concat(...args){
		if (args.length === 2){
			const [seqA, seqB] = args
			const outputSequence = clone(seqA)
			seqB.notes.forEach(note => {
				const clonedNote = Object.assign({}, note)
				clonedNote.startTime += seqA.totalTime
				clonedNote.endTime += seqA.totalTime
				outputSequence.notes.push(clonedNote)
			})
			outputSequence.totalTime = seqA.totalTime + seqB.totalTime
			return outputSequence
		} else if (args.length > 2){
			//concat the last two
			//get the first arg
			const first = args.shift()
			return this.concat(first, this.concat(...args))
		} else {
			return args[0]
		}
	}
}

