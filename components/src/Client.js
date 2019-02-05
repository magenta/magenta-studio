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

const ROUTE = 'http://localhost:3333'
import { encode, decode } from '../../magenta4live.amxd/code/src/Notes'

async function GET(path){
	return await fetch(`${ROUTE}/${path}`)
}

async function POST(path, body){
	return await fetch(`${ROUTE}/${path}`, {
		method : 'POST',
		body : JSON.stringify(body),
		headers : {
			Accept : 'application/json',
			'Content-Type' : 'application/json'
		}
	})
}

async function CALL(method, args){
	const response = await fetch(`${ROUTE}/call`, {
		method : 'POST',
		body : JSON.stringify({ method, args }),
		headers : {
			Accept : 'application/json',
			'Content-Type' : 'application/json'
		}
	})
	return await response.json()
}

/**
 * Returns true if it's connected to Live
 */
export async function connected(){
	try {
		await GET('status')
		return true
	} catch (e){
		return false
	}
}

export async function setNotes(args){
	args.notes = encode(args.notes)
	const response = await CALL('set_notes', args)
	return response
}

export async function getNotes(id){
	const response = await CALL('get_notes', { id })
	response.notes = decode(response.notes)
	return response
}

/**
 * Get all the tracks
 */
export async function tracks(){
	return await CALL('tracks')
}

/**
 * Get all the clips in a track
 */
export async function clips(id){
	return await CALL('clips', { id })
}

/**
 * Make sure a track has at least this many clips
 */
export async function setTrackLength(id, length){
	return await CALL('set_track_length', { length, id })
}
