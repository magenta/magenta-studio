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

outlets = 2
inlets = 1

function out(responseId, data){
	if (typeof data !== 'object'){
		data = {}
	}
	outlet(0, JSON.stringify({ id : responseId, data : data }))
}

/**
 * Main interface to remotely invoking functions
 */
function remote_invoke(method, args, responseId){
	try {
		args = JSON.parse(args)
		var response = this[method](args)
		out(responseId, response)
	} catch (e){
		out(responseId, { error : e })
	}
}

/**
 * Get all of the clips of a track
 */
function clips(args){
	var track = new LiveAPI()
	track.id = args.id
	var clips = track.get('clip_slots')
	var retClips = []
	for (var j = 0; j < clips.length; j++){
		if (clips[j] !== 'id'){
			var clipSlot = new LiveAPI()
			clipSlot.id = clips[j]
			var hasClip = Boolean(clipSlot.get('has_clip')[0])
			var clipName = ''
			if (hasClip){
				var innerClip = new LiveAPI()
				innerClip.id = clipSlot.get('clip')[1]
				clipName = innerClip.get('name')[0]
			}
			retClips.push({
				id : clips[j],
				empty : !hasClip,
				name : clipName
			})
		}
	}
	return retClips
}

/**
 *  get all the midi tracks
 */
function tracks(){
	var api = new LiveAPI()
	api.path = 'live_set'
	var tracks = api.get('tracks')
	var retTracks = []
	for (var i = 0; i < tracks.length; i++){
		if (tracks[i] !== 'id'){
			var track = new LiveAPI()
			track.id = parseInt(tracks[i])
			if (parseInt(track.get('has_midi_input'))){
				retTracks.push({
					name : track.get('name')[0],
					id : parseInt(track.id),
				})
			}
		}
	}
	return retTracks
}

/**
 * Set the notes from a JSON object of notes
 */
function set_notes(args){
	var clip = new LiveAPI()
	clip.id = args.id
	if (clip.get('has_clip')[0]){
		clip.call('delete_clip')
	}
	//set it to the clip
	clip.call('create_clip', args.duration)
	//get the clip that was just created
	post(clip.get('clip')[1])
	clip.id = parseInt(clip.get('clip')[1])
	clip.set('name', args.name)
	clip.set('color', args.color)
	// clip.set('loop_length', args.duration)
	clip.call('set_notes')
	var notes = args.notes
	for (var i = 0; i < notes.length; i++){
		var note = notes[i]
		clip.call.apply(clip, note)
	}
	return {
		id : clip.id
	}
}

/**
 * Get all of the notes
 */
function get_notes(args){
	var clip = new LiveAPI()
	clip.id = args.id
	if (clip.type === 'ClipSlot'){
		clip.id = clip.get('clip')[1]
	}
	return {
		id : clip.id,
		notes : clip.call('get_notes', 0, 0, 10000, 127),
		duration : clip.get('end_time')[0]
	}
}

/**
 * set the number of clips in a track
 */
function set_track_length(args){
	var track = new LiveAPI()
	track.id = args.id
	var currentSlots = track.get('clip_slots').length/2
	while (currentSlots < args.length){
		//duplicate
		track.call('duplicate_clip_slot', currentSlots-1)
		currentSlots++
	}
}
