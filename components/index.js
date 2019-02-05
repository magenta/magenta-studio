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

import './theme.scss'
import './main.scss'
import './src/File'
import './src/Select'
import './src/Tabs'
import './src/MidiFile'
import './src/Slider'
import './src/Button'
import './src/Snackbar'
import './src/Radio'
import './src/OutputText'
import './src/Popup'
import './src/Close'

//FORCE CPU BACKEND WHEN WEBGL IS VERSION !
import { tf } from '@magenta/music'

if (window.ENV && window.ENV.features && window.ENV.features.WEBGL_VERSION === 1){
	tf.setBackend('cpu')
	console.log('backend set to', tf.getBackend())
}

