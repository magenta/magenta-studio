import { render, html } from 'lit';
import './style.scss'

export function About(parentElement) {
  render(html`
    <h2 id="title">Magenta Studio</h2>
    <center><p>Version: ${VERSION}</p></center>
    <p>
      Find information and tutorials at
      <a target="_blank" href="https://magenta.tensorflow.org/studio/">our website.</a>
    </p>
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
  `, parentElement)
}