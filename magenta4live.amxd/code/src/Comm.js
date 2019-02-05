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

const max = require('max-api')
const uniqid = require('uniqid')

console.log = (...args) => {
	max.post(args.map(arg => {
		if (typeof arg === 'object'){
			return JSON.stringify(arg)
		} else {
			return arg
		}
	}).join(' '))
}

const timers = {}

console.time = (name) => {
	timers[name] = Date.now()
}

console.timeEnd = (name) => {
	if (timers[name]){
		const dur = Date.now() - timers[name]
		console.log(`${name}: ${dur.toFixed(2)}ms`)
	}
}

/**
 *  All of the currently pending messages
 *  @type  {Object}
 */
const pendingMessages = {}

max.addHandler('from-js', e => {
	try {
		const event = JSON.parse(e)
		if (pendingMessages[event.id]){
			pendingMessages[event.id](event.data)
			delete pendingMessages[event.id]
		}
	} catch (e){
		
	}
})

async function outlet(...args){
	const id = uniqid()
	const promise = new Promise(done => pendingMessages[id] = done)
	await max.outlet(['to-js', ...args, id])
	return await promise
}

module.exports = {
	outlet,
	inlet(name, handler){
		max.addHandler(name, handler)
	},
	async message(name, args){
		await outlet('message', name, JSON.stringify(args))
	}
}
