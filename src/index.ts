/**
 * domainr-node
 * Copyright (C) 2021 Marvin Schopf
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @license Apache-2.0
 * @copyright 2021 Marvin Schopf
 * @author Marvin Schopf <marvin@schopf.biz>
 *
 */

import fetch from "node-fetch";

const apiBaseUrls = {
	standard: "https://domainr.p.rapidapi.com",
	enterprise: "https://api.domainr.com",
};

function buildQueryString(params: any): string {
	return Object.keys(params)
		.map((k: string) =>
			params[k]
				? encodeURIComponent(k) + "=" + encodeURIComponent(params[k])
				: ""
		)
		.join("&");
}

async function asyncForEach(array: any, callback: Function): Promise<void> {
	for (let index: number = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

export class DomainrClient {
	apiKey: string;
	endpoint: "standard" | "enterprise";
	constructor(
		apiKey: string,
		options?: {
			endpoint?: "standard" | "enterprise";
		}
	) {
		this.apiKey = apiKey;
		this.endpoint = options
			? options.endpoint
				? options.endpoint
				: "standard"
			: "standard";
	}

	public async register(domain: string, registrar?: string): Promise<string> {
		const response = await fetch(
			`${apiBaseUrls[this.endpoint]}/v2/register?${buildQueryString({
				"mashape-key":
					this.endpoint === "standard" ? this.apiKey : false,
				client_id: this.endpoint === "enterprise" ? this.apiKey : false,
				domain: domain,
				registrar: registrar ? registrar : false,
			})}`,
			{
				redirect: "manual",
			}
		);
		if (response.status === 302) {
			if (response.headers.has("Location")) {
				// @ts-ignore
				return response.headers.get("Location");
			} else {
				throw new Error(
					"Domainr: No `Location` header in the response."
				);
			}
		} else {
			const json = await response.json();
			if (json && json.message) {
				throw new Error(`Domainr: ${json.message}`);
			} else {
				throw new Error(
					`Domainr: HTTP ${response.status} ${response.statusText}`
				);
			}
		}
	}

	public async status(
		domain: string
	): Promise<
		{
			domain: string;
			zone: string;
			status: string[];
		}[]
	> {
		const response = await fetch(
			`${apiBaseUrls[this.endpoint]}/v2/status?${
				this.endpoint === "enterprise" ? "client_id" : "mashape-key"
			}=${this.apiKey}&domain=${domain}`
		);
		if (response.status === 200) {
			let statuses = (await response.json()).status;
			await asyncForEach(
				statuses,
				async (
					status: {
						domain: string;
						zone: string;
						status: string;
						summary?: string;
					},
					statusIndex: number
				) => {
					statuses[statusIndex] = {
						domain: status.domain,
						zone: status.zone,
						status: status.status.split(" "),
					};
				}
			);
			return statuses;
		} else {
			const json = await response.json();
			if (json && json.message) {
				throw new Error(`Domainr: ${json.message}`);
			} else {
				throw new Error(
					`Domainr: HTTP ${response.status} ${response.statusText}`
				);
			}
		}
	}

	public async search(
		query: string,
		options?: {
			location?: string;
			registrar?: string;
			defaults?: string[];
			keywords?: string[];
		}
	): Promise<
		{
			domain: string;
			host: string;
			subdomain: string;
			zone: string;
			path: string;
			registerURL: string;
		}[]
	> {
		const response = await fetch(
			`${apiBaseUrls[this.endpoint]}/v2/search?${buildQueryString({
				"mashape-key":
					this.endpoint === "standard" ? this.apiKey : false,
				client_id: this.endpoint === "enterprise" ? this.apiKey : false,
				query: query,
				location: options
					? options.location
						? options.location
						: false
					: false,
				registrar: options
					? options.registrar
						? options.registrar
						: false
					: false,
				defaults: options
					? options.defaults
						? options.defaults.join(",")
						: false
					: false,
				keywords: options
					? options.keywords
						? options.keywords.join(",")
						: false
					: false,
			})}`
		);
		if (response.status === 200) {
			const results: {
				domain: string;
				host: string;
				subdomain: string;
				zone: string;
				path: string;
				registerURL: string;
			}[] = (await response.json()).results;
			return results;
		} else {
			const json = await response.json();
			if (json && json.message) {
				throw new Error(`Domainr: ${json.message}`);
			} else {
				throw new Error(
					`Domainr: HTTP ${response.status} ${response.statusText}`
				);
			}
		}
	}
}

export default DomainrClient;
