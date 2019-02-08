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

const { outlet } = require('./src/Comm')
const express = require('express')
const app = express()
app.use(require('body-parser').json())
const kill = require('kill-port')
const detect = require('detect-port')
const max = require('max-api')
require('./src/Launch')

///////////////////////////////////////////////////////////////////////////////
// CONFIG
///////////////////////////////////////////////////////////////////////////////

const PORT = 3333

///////////////////////////////////////////////////////////////////////////////
// ROUTES
///////////////////////////////////////////////////////////////////////////////

async function getId(path){
	const id = await outlet('path', decodeURIComponent(path))
	return parseInt(id)
}

// ID /////////////////////////////////////////////////////////////////////////

/**
 * Get the current connection status of Live
 */
app.get('/status', (req, res) => res.send('connected'))

// PATHS //////////////////////////////////////////////////////////////////////

app.post('/call', async (req, res) => {
	const response = await outlet('remote_invoke', req.body.method, JSON.stringify(req.body.args))
	res.send(response)
})

///////////////////////////////////////////////////////////////////////////////
// START SERVER
///////////////////////////////////////////////////////////////////////////////

let server = null

async function startServer(){
	const availPort = await detect(PORT)
	if (PORT !== availPort){
		//try and kill the port, and then try again
		console.log(`killing server on ${PORT}`)
		await kill(PORT)
		//try again
		max.outlet('server', 0)
		setTimeout(() => startServer(), 1000)
	} else {
		server = app.listen(PORT, () => {
			max.outlet('server', 1)
			console.log(`server started on ${PORT}`)
		})
	}
}

startServer()

process.on('exit', () => {
	if (server){
		server.close()
	}
})

