// import Navigo from 'navigo'
import { render, html, nothing } from 'lit'
// import { About } from './about'
// import { Continue } from './continue/Main'
// import { Drumify } from './drumify/Main'
// import { Generate } from './generate/Main'
// import { Groove } from './groove/Main'
// import { Interpolate } from './interpolate/Main'
import { Duet} from './duet/Main';
import logo from './magenta_logo.png'

document.addEventListener('DOMContentLoaded', function(){
	const pluginContainer = document.getElementById('plugin-container')
// 	const router = new Navigo('/')
// 	router.on('/', function(){
// 		render(nothing, pluginContainer)
// 		About(pluginContainer)
// 	})
// 	router.on('/continue', function(){
// 		render(nothing, pluginContainer)
// 		Continue(pluginContainer)
// 	})
// 	router.on('/drumify', function(){
// 		render(nothing, pluginContainer)
// 		Drumify(pluginContainer)
// 	})
// 	router.on('/generate', function(){
// 		render(nothing, pluginContainer)
// 		Generate(pluginContainer)
// 	})
// 	router.on('/groove', function(){
// 		render(nothing, pluginContainer)
// 		Groove(pluginContainer)
// 	})
// 	router.on('/interpolate', function(){
// 		render(nothing, pluginContainer)
// 		Interpolate(pluginContainer)
// 	})

	setTimeout(() => {
		Duet(pluginContainer)
		document.body.style.display = 'flex'
	}, 10)
}, false)

render(html`
  <div class="logo-container">
    <h1 class="logo-header">Magenta Studio</h1>
    <img class="logo" src="${logo}" alt="Magenta Logo" width="50" height="50">
  </div>
  <div id="plugin-container">
  </div>
`, document.body)
