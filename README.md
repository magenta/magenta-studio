This repo is where the code to Magenta Studio is maintained. For information, support and installation instructions of the tools themselves go to [this website](https://magenta.tensorflow.org/studio/).

This is not a Google product. 

## Overview and Organization

Magenta Studio is a set of plugins contained in a [Max for Live](https://www.ableton.com/en/live/max-for-live/) Device. They are contained in a single web application that runs in the Max environment via Chromium Embedded Framework (CEF). All of the front-end code is contained in the `client/` folder, which contains the five plugins, and common UI and communication components which can be found in the `client/components/` folder. These objects are built using [lit](https://lit.dev/). 

The communication between the web application and Live is handed through Max. This contains a local express server that runs on port 3333 (or 3334, 3335, etc if you have multiple instances open) in [Node for Max](https://cycling74.com/articles/node-for-max-intro-%E2%80%93-let%E2%80%99s-get-started). The Max patch and related JavaScript files can be found in the folder called `magenta4live.amxd/`.

## Installation

Tested with Node LTS v18.12.1. 

If you have node.js and npm installed on your computer, all of the dependencies can be installed by running 

```
npm install
```

## Development

To run the front-end web application in development mode, in which webpack will rebuild the app when changes are made, you can run

```
npm run watch
```

You will need to open the Max project to start the express server to test your changes. You can either view the app in the [`jweb`] object in Max, or load it in the browser at [http://localhost:3333](http://localhost:3333) (again, 3334, 3335, etc. if there are multiple instances running). Hot reloading is not enabled, so you will need to refresh to see changes.

## Building

All of the modules are included in a Max for Live device. To build the device, run

```
npm run build
```

All of the build files will be placed into the folder `magenta4live.amxd/code/public`.

Open the Max project, then select File > Export Max for Live Device..., and then select a location to save the device. Once the dialog closes, the device has been built!

Lastly, you'll need to change the icon of the `magenta4live` device. You can do this (on Mac) by:
1. Open the Magenta icon (`client/magenta_logo`) in Preview.
2. Select Edit > Copy
3. Right click on `magenta4live.amxd`, then select Get Info. 
4. Select the tiny icon in the upper left of the window, and select Edit > Paste or enter Command + V. 
5. Done!

## Versioning
You can update the version of the device by changing the version in the root `package.json`. When you build the device, this number will be visible when you click "About" in the interface.

## License

Copyright 2023 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
