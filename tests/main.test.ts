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

import test from "ava";
import isURL from "validator/lib/isURL";

import { DomainrClient } from "./../src";

function randomString(length: number): string {
	let result: string = "";
	for (let i: number = 0; i < length; i++) {
		result += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'".charAt(
			Math.floor(
				Math.random() *
					"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
						.length
			)
		);
	}
	return result;
}

const DOMAINR_API_KEY: string = process.env.DOMAINR_API_KEY
	? process.env.DOMAINR_API_KEY
	: "";

const client: DomainrClient = new DomainrClient(DOMAINR_API_KEY);

test("search pizza", async (t) => {
	t.is((await client.search("pizza")).length, 5);
	t.not(await client.search("pizza"), null);
});

test("status pizza.com", async (t) => {
	t.is(await client.status("pizza.com"), [
		{ domain: "pizza.com", zone: "com", status: ["active"] },
	]);
});

test("status google.de", async (t) => {
	t.is(await client.status("google.de"), [
		{ domain: "google.de", zone: "de", status: ["active"] },
	]);
});

test("register random 1", async (t) => {
	t.is(isURL(await client.register(`${randomString(128)}.net`)), true);
});

test("status random 1", async (t) => {
	const RANDOM_STRING: string = randomString(128);
	t.is(await client.status(`${RANDOM_STRING}.net`), [
		{
			domain: `${RANDOM_STRING}.net`,
			zone: "net",
			status: ["undelegated", "inactive"],
		},
	]);
});