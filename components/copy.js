const fs = require('fs-extra')
const { resolve } = require('path')

async function main(){
	const promises = ['continue', 'generate', 'groovae', 'interpolate'].map(f => {
		const components = resolve(__dirname, '../build/components.js')
		const outFolder = resolve(__dirname, '../', f, 'build/components.js')
		return fs.copy(components, outFolder)
	})
	await Promise.all(promises)
}
main()

