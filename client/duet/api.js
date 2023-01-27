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

export class API {
    constructor(baseUrl, apiInterface) {
        this.baseUrl = baseUrl
        this.apiInterface = apiInterface;
    };

    generateUrl(endpoint) {
        return `https://${this.baseUrl}${endpoint}`
    }

    async fetch(method, data = {}) {
        const selectedMethod = this.apiInterface[method];
        if (!selectedMethod) return;
        const url = this.generateUrl(selectedMethod.endpoint);
        const response = await fetch(url, {
            method: selectedMethod.method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(await response.text());
        }
    }
}
