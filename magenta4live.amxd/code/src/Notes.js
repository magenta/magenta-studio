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

/**
 * Decode the notes array from the Ableton format
 */

function decodeNote(noteDesc){
	const [note, pitch, time, duration, velocity=100, muted=0] = noteDesc
	return {
		pitch, time, 
		startTime : time, 
		endTime : time+duration, 
		duration, velocity, muted
	}
}

function decode(notesArray){
	//the array should start with 'notes'
	if (notesArray.shift() !== 'notes'){
		throw new Error('not a notes array')
	}
	const retNotes = []
	//shift off the length
	const count = notesArray.shift()
	const descLen = 6
	for (let i = 0; i < count; i++){
		const noteDesc = notesArray.slice(i*descLen, (i+1)*descLen)
		retNotes.push(decodeNote(noteDesc))
	}
	retNotes.sort((a, b) => a.time - b.time)
	return retNotes
}

/**
 * Encode a note array into the ableton format
 */

function encodeNote(note){
	const { pitch, startTime, endTime, velocity=100, muted=0 } = note
	return ['note', pitch, startTime.toFixed(2), (endTime - startTime).toFixed(2), velocity, muted]
}

function encode(notesArray){
	let ret = [['notes', notesArray.length]]
	notesArray.forEach(n => ret.push(encodeNote(n)))
	ret.push(['done'])
	return ret
}

module.exports = { encode, decode }
