This repo is where the code to Magenta Studio is maintained. For information, support and installation instructions of the tools themselves go to [this website](https://magenta.tensorflow.org/studio/)

This is not a Google product. 

## Overview and Organization

Magenta Studio is a set of plugins contained in a [Max for Live](https://www.ableton.com/en/live/max-for-live/) Device. They are contained in a single web application that runs in the Max environment via Chromium Embedded Framework (CEF). All of the front-end code is contained in the `client/` folder, which contains the five plugins, and common UI and communication components which can be found in the `client/components/` folder. These objects are built using [Polymer's LitElement](https://github.com/Polymer/lit-element). 

The communication between the web application and Live is handed through Max. This contains a local express server that runs on port 3333 in [Node for Max](https://cycling74.com/articles/node-for-max-intro-%E2%80%93-let%E2%80%99s-get-started). The Max patch and related JavaScript files can be found in the folder called `magenta4live.amxd/`.

## Installation

If you have node.js and npm installed on your computer, all of the dependencies can be installed by running 

```
npm install
```

## Building

All of the modules are included in a Max for Live device. To build the device, run

```
npm run build
```

All of the build files will be placed into the folder `magenta4live.amxd/code/public`.

Then, run (on Mac)
```
open magenta4live.amxd/magenta4live.amxd.maxproj
```
or simply open the Max project. Then select File > Export Max for Live Device..., and select a location to save the device. Once the dialog closes, the device has been built!

## License

Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
