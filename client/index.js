import Navigo from 'navigo'
import { LitElement, render, html, nothing } from 'lit'
import { About } from './about'
import { Continue } from './continue/Main'
import { Drumify } from './drumify/Main'
import { Generate } from './generate/Main'
import { Groove } from './groove/Main'
import { Interpolate } from './interpolate/Main'


document.addEventListener('DOMContentLoaded', function () {
  const pluginContainer = document.getElementById("plugin-container")
  const router = new Navigo('/')
  router.on('/', function () {
    render(nothing, pluginContainer)
    About(pluginContainer)
  })
  router.on('/continue', function () {
    render(nothing, pluginContainer)
    Continue(pluginContainer)
  })
  router.on('/drumify', function () {
    render(nothing, pluginContainer)
    Drumify(pluginContainer)
  })
  router.on('/generate', function () {
    render(nothing, pluginContainer)
    Generate(pluginContainer)
  })
  router.on('/groove', function () {
    render(nothing, pluginContainer)
    Groove(pluginContainer)
  })
  router.on('/interpolate', function () {
    render(nothing, pluginContainer)
    Interpolate(pluginContainer)
  })
}, false);


render(html`
  <nav>
    <a href="/" data-navigo class="about-button">About</a>
    <a href="/continue" data-navigo class="continue-button">Continue</a>
    <a href="/drumify" data-navigo class="drumify-button">Drumify</a>
    <a href="/generate" data-navigo class="generate-button">Generate</a>
    <a href="/groove" data-navigo class="groove-button">Groove</a>
    <a href="/interpolate" data-navigo class="interpolate-button">Interpolate</a>
  </nav>
  <div id="plugin-container"></div>
`, document.body)
