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

import { LitElement, html } from '@polymer/lit-element'
import './File'
import './Select'
import './Tabs'
import { toNoteSequence, fromNoteSequence } from './Convert'
import * as Live from './Client'
const { dialog } = require('electron').remote
import { throttle } from 'throttle-debounce'
import chroma from 'chroma-js'
import { popup } from './Popup'

export class AbletonFile extends LitElement {

	static get properties(){
		return {
			connected : { type : String },
			numclips : { type : Number },
			output : { type : Boolean }
		}
	}

	constructor(){
		super()
		this.connected = false
		this.output = false
		this.numclips = 1
		this.tracks = []
		this.clips = []
		
		setInterval(() => this.testConnection(), 2000)
		//test the connection initially
		this.testConnection()

		this._throttledTrackUpdate = throttle(2000, this.updateTracks.bind(this))
		this._throttledClipUpdate = throttle(2000, this.updateClips.bind(this))
	}

	async read(){
		await this.sync()
		const clips = this.selectedClips
		if (!clips){
			throw new Error('No clip in selected slot')
		}
		const notes = await Promise.all(clips.map(c => Live.getNotes(c.id))) 
		const seqs = notes.map(({ notes, duration }) => toNoteSequence(notes, duration))
		if (seqs.length > 1){
			return seqs
		} else {
			return seqs[0]
		}
	}

	async write(sequences, prefix){
		await this.sync()
		const selectedClips = this.selectedClips
		const lastClip = selectedClips[selectedClips.length-1]
		if (!lastClip){
			return
		}
		const totalLength = this.outputPath + sequences.length
		const overwrittenClips = []
		//test if there are any clips to overwrite
		for (let i = this.outputPath; i < totalLength; i++){
			const clip = this.clips.filter(c => !c.empty).find(c => c.index === i)
			if (clip){
				overwrittenClips.push(clip)
			}
		}
		let writeClips = true
		if (overwrittenClips.length){
			writeClips = await this._overwriteClips(overwrittenClips.filter(c => c && !c.empty))
		}
		
		if (writeClips){
			const clipNames = this.selectedClips.map(c => c.name).join('+')
			const trackId = this.tracks[this.selectedTrackIndex].id
			await Live.setTrackLength(trackId, totalLength)
			const outputClips = (await Live.clips(trackId)).slice(this.outputPath, totalLength)
			const color = window.getComputedStyle(this, null).getPropertyValue('color')
			await Promise.all(sequences.map((seq, i) => {
				const clip = outputClips[i]
				const notes = fromNoteSequence(seq)
				const trackName = this.output ? prefix : `[${clipNames}]`
				return Live.setNotes({
					id : clip.id,
					notes,
					duration : seq.totalTime,
					name : `${i+1}/${sequences.length} ${trackName}`,
					color : chroma(color).num()
				})
			})) 
		}
	}

	async _overwriteClips(paths){
		const maxLen = 6
		paths = paths.map(p => p.name)
		if (paths.length > maxLen){
			const len = paths.length
			paths = paths.slice(0, maxLen)
			paths[maxLen-1] = `${len-(maxLen-1)} more...`
		}
		const response = await popup({
			title : `Overwrite clip${paths.length > 1 ? 's' : ''}?`,
			body : `
				These clips will be saved over:
				<ul>
					${paths.map(p => `<li>${p}</li>`).join(' ')}
				</ul>
			`
		})
		return response === 'ok'
	}

	get selectedTrackIndex(){
		if (this.shadowRoot.querySelector('#track')){
			if (this.shadowRoot.querySelector('#track').selectedIndex === -1){
				return 0
			} else {
				return this.shadowRoot.querySelector('#track').selectedIndex - 1
			}
		} else {
			return 0
		}
	}

	updated(props){
		if (props.has('connected')){
			this.dispatchEvent(new CustomEvent(this.connected ? 'connected' : 'disconnected'))
			this._emitChange()
		}
		super.updated()
	}

	async testConnection(){
		this.connected = await Live.connected()
	}

	async sync(){
		if (this.connected){
			await this.updateTracks()
			await this.updateClips()
		} else {
			throw new Error('Cannot communicate with Live. Make sure that the plugin is present.')
		}
	}

	async _trackChanged(){
		this.clearClips()
		await this.updateClips()
		this._emitChange()
	}

	async updateTracks(){
		this.tracks = await Live.tracks()
		this.requestUpdate()
	}

	_emitChange(){
		this.dispatchEvent(new CustomEvent('change', { bubbles : true, composed : true }))
	}

	async updateClips(){
		const index = this.selectedTrackIndex
		if (this.tracks[index]){
			const trackId = this.tracks[index].id
			this.clips = await Live.clips(trackId)
			this.clips.forEach((c, i) => {
				if (c.name === ''){
					c.name = `Slot ${i + 1}`
				}
				c.index = i
			})
			if (!this.output){
				this.clips = this.clips.filter(c => !c.empty)
			}
			this.requestUpdate()
		}
	}

	get valid(){
		return Array.from(this.shadowRoot.querySelectorAll('magenta-select')).every(s => s.valid) && this.connected
	}

	get selectedClips(){
		const indices = Array.from(this.shadowRoot.querySelectorAll('.clip')).map(s => s.selectedIndex)
		return indices.map(i => this.clips[i-1])
	}

	clearClips(){
		Array.from(this.shadowRoot.querySelectorAll('.clip')).forEach(s => s.selectedIndex = 0)
	}

	get outputPath(){
		if (this.valid){
			const selected = this.selectedClips
			const indices = selected.map(s => s.index)
			return Math.max(...indices) + (this.output ? 0 : 1)
		}
	}

	render(){
		const clips = []
		for (let i = 0; i < this.numclips; i++){
			let clipLabel = this.numclips > 1 ? 'AB'.charAt(i) : ''
			clips.push(html`
				<magenta-select 
					@mouseover=${this._throttledClipUpdate}
					@focus=${this._throttledClipUpdate}
					@change=${this._emitChange.bind(this)}
					outlined 
					class="clip" label="Choose Clip ${clipLabel}" values=${JSON.stringify(this.clips.map(c => c.name))}>
				</magenta-select>`)
		}
		return html`
			<style>
				:host {
					display: block;
					color: var(--accent-color);
				}

				magenta-select {
					display: block;
					width: 80%;
					margin: 0 auto;
					min-width: 260px;
					margin-bottom: 10px;
				}

				magenta-select:first-child{
					margin-top: 12px;
				}

				div[disabled]{
					pointer-events: none;
					opacity: 0.4;
				}

			</style>
			<div ?disabled=${!this.connected}>
				<magenta-select outlined 
					@mouseover=${this._throttledTrackUpdate}
					@focus=${this._throttledTrackUpdate}
					@change=${this._trackChanged.bind(this)}
					id="track" label="Choose Track" values=${JSON.stringify(this.tracks.map(t => t.name))}>
				</magenta-select>
				${clips}
			</div>
		`
	}
}

customElements.define('magenta-ableton-file', AbletonFile)
