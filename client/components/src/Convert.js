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

const { sequences } = require('@magenta/music')
const { quantizeNoteSequence, unquantizeSequence } = sequences

export function toNoteSequence(notes, duration) {
	return quantizeNoteSequence(
		{
			ticksPerQuarter: 220,
			totalTime: duration,
			timeSignatures: [
				{
					time: 0,
					numerator: 4,
					denominator: 4
				}
			],
			tempos: [
				{
					time: 0,
					qpm: 60
				}
			],
			notes: notes.filter(n => !n.muted)
		},
		4
	)
}

export function fromNoteSequence(seq) {
	const notes = seq.notes;
	const stepsPerQuarter = seq.quantizationInfo.stepsPerQuarter
	return notes.map((note) => {
		return {
			...note,
			startTime: note.quantizedStartStep / stepsPerQuarter,
			endTime: note.quantizedEndStep / stepsPerQuarter,
			muted: 0
		}
	});
}

// seq.notes.forEach((note) => {
// 	note.startTime = 
// })

// { pitch, startTime, endTime, velocity=100, muted=0 }
// {pitch: 76, velocity: 53, quantizedStartStep: 20, quantizedEndStep: 47}
// pitch, beats, beats, velocity, muted
