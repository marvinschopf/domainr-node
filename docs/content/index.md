# 💻 domainr-node

`domainr-node` is a [Domainr](https://domainr.com) API client written for Node that fully supports both the standard and enterprise versions.

## Installation

Using `npm`:

```bash
npm install domainr-node
```

Using `yarn`:

```bash
yarn add domainr-node
```

## Usage

First of all, an API key must be generated. This can be done [here](https://rapidapi.com/domainr/api/domainr).

`domainr-client` is based entirely on an asynchronous Promise API.

```javascript
const { DomainrClient } = require("domainr-node");
// alternatively, with modern ES syntax
import { DomainrClient } from "domainr-node";

const client = new DomainrClient("YOUR-API-KEY", {
	// OPTIONAL
	endpoint: "standard", // Use "enterprise" if you have an API key for the high volume API
});
```

### `search`

```javascript
await client.search("pizzashop");
/** => RETURNS
    [
    {
        domain: 'pizza.shop',
        host: '',
        subdomain: 'pizza.',
        zone: 'shop',
        path: '',
        registerURL: 'https://api.domainr.com/v2/register?client_id=mashape-XXX&domain=pizza.shop&gl=de&registrar=&source='
    },
    {
        domain: 'pizza.shopping',
        host: '',
        subdomain: 'pizza.',
        zone: 'shopping',
        path: '',
        registerURL: 'https://api.domainr.com/v2/register?client_id=mashape-XXX&domain=pizza.shopping&gl=de&registrar=&source='
    },
    {
        domain: 'pizza.store',
        host: '',
        subdomain: 'pizza.',
        zone: 'store',
        path: '',
        registerURL: 'https://api.domainr.com/v2/register?client_id=mashape-XXX&domain=pizza.store&gl=de&registrar=&source='
    },
    ...
  ]
*/
```

### `status`

```javascript
await client.status("pizzashop.com");
// => [ { domain: 'pizzashop.com', zone: 'com', status: [ 'active' ] } ]

await client.status("JustSomeRandomDomainName.com");
/* => RETURNS
[
  {
    domain: 'JustSomeRandomDomainName.com',
    zone: 'com',
    status: [ 'undelegated', 'inactive' ]
  }
]
*/
```

### `register`

```javascript
await client.register("JustSomeRandomDomainName.com");
// => https://iwantmyname.com/partner/search?r=domai.nr&u=XXXXXX&b=XXXXXXX&q=JustSomeRandomDomainName.com
```

## LICENSE

Copyright (C) 2021 Marvin Schopf

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
