![Logo](https://cdn.discordapp.com/emojis/843908573578002512.gif) Robert

the most shitty generic node js http package

its description should probably be something like the best unopinionated easy to use minimal node js http framework

ok docs time

NOTE: fuck typings i gave up on that shit it made me angry

# Usage

```js
const robert = require("robert");
```

Make a simple GET request

```js
robert
    .get('https://api.zeppelin.gg/')
    .send()
    .json();

// Returns
{
    data: { status: 'cookies', with: 'milk' },
    statusCode: 200,
    statusMessage: 'OK',
    headers: { ... }
};
```

Send a Discord Message

```js
robert
    .post('https://discord.com/api/v9/channels/{CHANNEL}/messages')
    .json({ content: 'robert best http client' })
    .header('Authorization', 'Bot {TOKEN}')
    .send()
    .json();

// Returns
{
    data: { content: 'robert best http client', ... },
    statusCode: 200,
    statusMessage: 'OK',
    headers: { ... }
};
```

Execute a Discord webhook using a client

```js
const client = new robert.Client({ base: 'https://discord.com/api/v9', headers: {} /* Optional */ })

client
    .post('/webhooks/{WEBHOOK_ID}/{WEBHOOK_TOKEN}')
    .query('wait', true)
    .json({ embeds: [{ description: 'this is from a robert client with base ' + client.base }] })
    .send()
    .json()

// Returns
{
    data: { embeds: [{ description: 'this is from a robert client with base https://discord.com/api/v9' }], ... },
    statusCode: 200,
    statusMessage: 'OK',
    headers: { ... }
};
```

# Documentation

Client (`Default`)

```js
// robert instaceof robert.Client = true

const client = new robert.Client({
    base: 'A base URL for all requests',
    port: 443 /* HTTPS default is 443 */,
    headers: { Some: 'default headers' }
})

client.header(key, value) // Set a default header
client.setHeaders({ key: value }) // Sets default headers

// All HTTPS methods (Returns request)
client.get(url)
...etc
```

Request

```js
const request = robert.get("https://api.zeppelin.gg/");

request.query(key, value); // Add a new query to the URL's parameters
request.setQuery({ key: value }); // Set the URL's query parameters
request.header(key, value); // Set a header
request.setHeaders({ key: value }); // Sets all headers
request.body(text); // Set text for the request body
request.json({ key: value }); // Set a json for the request body
request.form({ key: value }); // Set a multipart form data for the request body
request.send(); // Send the request, returns Response
```

Response

```js
const response = robert.get("https://api.zeppelin.gg/").send();

// All return a promise
// NOTE: ... = { statusCode: Number, statusMessage: String, headers: Object }

response.stream(); // { data: ReadableStream, ... }
response.buffer(); // { data: Buffer, ...  }
response.bufferArray(); // { data: Array<Buffer>, ...  }
response.arrayBuffer(); // { data: arrayBuffer, ...  }
response.blob(); // { data: Blob, ...  }
response.text(); // { data: String, ... }
response.json(); // { data: Object, ... }
```
