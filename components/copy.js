const fs = require('fs-extra')
const { resolve } = require('path')
const apps = require('../apps.json')

async function main(){
	// const folders = glob.sync(resolve(__dirname, '../*/Config.json'))
	const dirs = Object.keys(apps)
	
	const promises = dirs.map(f => {
		const components = resolve(__dirname, '../build/components.js')
		const outFolder = resolve(__dirname, '../', f, 'build/components.js')
		return fs.copy(components, outFolder)
	})
	await Promise.all(promises)
}
main()

