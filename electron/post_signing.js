const glob = require('glob-promise')
const fs = require('fs-extra')
const { resolve, dirname, basename } = require('path')

async function main(){
	//place all of the apps back into their corresponding folders
	const apps = await glob(resolve(__dirname, '../dist/to-sign/*/*.+(app|exe)'))
	//the directory of each app
	const dirs = apps.map(a => basename(dirname(a)))

	apps.forEach(async (app, i) => {
		const dir = dirs[i]
		const outputDir = resolve(__dirname, '../dist', dir)
		const appName = basename(app)
		//find the corresponding app
		const sameApp = await glob(resolve(outputDir, '**', appName))
		//overwrite the existing app
		await fs.move(app, sameApp[0], { overwrite : true })
	})
}

main()

