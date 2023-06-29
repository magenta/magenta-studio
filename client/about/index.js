import { render, html } from 'lit'
import './style.scss'

// This function sends an HTTP request to the server to open
// https://magenta.tensorflow.org/studio/ in the default browser.
// In CEF, you can't open links in the default browser, but it is
// possible to do this in Max.
function handleOpenWebsite(e) {
  e.preventDefault()
  fetch(e.target.href)
}

export function About(parentElement) {
  render(html`
    <div class="about">
      <h2 id="title">Magenta Studio</h2>
      <center><p>Version: ${VERSION}</p></center>
      <p>
      Magenta Studio is a MIDI plugin for Ableton Live built on Magenta’s open source tools and models.
      It uses cutting-edge machine learning techniques for music generation.
      </p>
      <p>
        Find more information and tutorials at
        <a target="_blank" href="/studio" @click=${handleOpenWebsite}>our website.</a>
      </p>
      <!--
      <p>
        <h3>License</h3>
        Copyright 2019 Google Inc.
        <br><br>
        Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
        <br><br>
        http://www.apache.org/licenses/LICENSE-2.0
        <br><br>
        Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
      </p>
    </div>
    -->
  `, parentElement)
}
