/**
 * @license
 * Copyright 2023 Google Inc. All Rights Reserved.
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


import { API } from './api';
import { performance } from '@magenta/music';

export class Model {
    INTERFACE = {
        GENERATE: {
            method: "POST",
            endpoint: "/generate"
        },
        CONNECT: {
            method: "POST",
            endpoint: "/connect"
        }
    }

    constructor(url) {
        this.api = new API(url, this.INTERFACE)
    }

    async newSequence() {
        const response = await this.api.fetch("GENERATE", { prime: [] });
        console.log(response);
        const performance = this.parsePerformanceEvents(response["continuation"], true);
        const { events } = performance;
        const sequence = this.events2seq(events);
        console.log(sequence);
        return [sequence];
    }

    async connect() {
        try {
            const response = await this.api.fetch("CONNECT", {});
            console.log("connected");
        } catch {
            throw new Error("Could not connect to Model Server Endpoint.")
        }
    }

    events2seq(events) {
        const perf = new performance.Performance(
            events,
            100 /*max steps*/,
            32 /*velocity bins*/
        );
        const seq = perf.toNoteSequence();
        // ML Model steps per second is 100, which depends on QPM = 120;
        const stepsPerQuarter = 50;
        seq.quantizationInfo = { stepsPerQuarter };
        seq.tempos = [{ time: 0, qpm: 120 }];
        return seq;
    }

    // adapted from https://github.com/magenta/music-transformer-visualization/blob/6c828cbfa2c1d272b755f2d9432e63b56db38363/parser.js#L242
    parsePerformanceEvents(rawEvents, newSeqFlag = false) {
        // parses python events into js events
        const events = [];
        let totalSteps = 0;
        for (let i = 0; i < rawEvents.length; i++) {
            const rawEvent = rawEvents[i];
            const eventType = rawEvent["type"];
            const value = rawEvent["value"];
            if (eventType == "TIME_SHIFT") {
                events.push({
                    type: "time-shift",
                    steps: value,
                });
                totalSteps += value;
            } else if (eventType == "NOTE_ON") {
                events.push({
                    type: "note-on",
                    pitch: value,
                });
            } else if (eventType == "NOTE_OFF") {
                events.push({
                    type: "note-off",
                    pitch: value,
                });
            } else if (eventType == "VELOCITY") {
                events.push({
                    type: "velocity-change",
                    velocityBin: value,
                });
            }
        }

        if (newSeqFlag == true) {
            // Shorten the first couple of timeshifts until you get a note.
            for (let i = 0; i < events.length; i++) {
                if (events[i].type !== "time-shift") {
                    break;
                }
                events[i].steps = 10;
            }
        }

        return { events, totalSteps };
    }
}
