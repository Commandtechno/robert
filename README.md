![Logo](https://cdn.discordapp.com/emojis/843908573578002512.gif)

# Ro🅱ert

genric node js https package pog lol

# What is robert?

![robert](https://cdn.discordapp.com/attachments/861222626915647489/866269177110855690/file.png)

its description should pro🅱a🅱ly 🅱e something like the 🅱est unopinionated easy to use minimal node js http framework

ok docs time

NOTE: ~~fuck typings i gave up on that shit it made me angry~~

NOTE #2: ~~i have reconsidered my previous anger and it is now in typescript~~

NOTE #3: i have re written robert once again idk why ask robert

# Usage

```js
// CommonJS
const robert = require("robert");

// Typescript / ES2019
import * as robert from "robert";
```

Make a simple GET request

```js
robert
  .get('https://api.zeppelin.gg/')
  .send('json');

// Returns
{
  status: 'cookies',
  with: 'milk'
};

// If you want status and headers use this

robert
  .get('https://api.zeppelin.gg/')
  .full()
  .send('json');

// Returns
{
  url: 'https://api.zeppelin.gg/',
  data: {
    status: 'cookies',
    with: 'milk'
  },
  status: 200,
  statusText: 'OK',
  headers: { ... }
};
```

Send a Discord Message

```js
robert
  .post('https://discord.com/api/v9/channels/{CHANNEL}/messages')
  .json({ content: 'robert best http client' })
  .auth('Bot {TOKEN}')
  .send('json');

// Returns
{
  content: 'robert best http client', ... }
};
```

Execute a Discord webhook using a client

```js
const client = robert.client('https://discord.com/api/v9')
  .query('wait', true)
  .format('json');

client
  .post('/webhooks/{WEBHOOK_ID}/{WEBHOOK_TOKEN}')
  .json({ embeds: [{ description: 'this is from a robert client with base ' + client.base }] })
  .send();

// Returns
{
  { embeds: [{ description: 'this is from a robert client with base https://discord.com/api/v9' }], ... }
};
```

# Documentation

Client (`Default`)

```js
// NOTE: All options are optional, by default robert is equal to robert.client() which have the following options by default
const client = robert.client({
  base: "",
  port: null,
  size: "10mb",
  query: {},
  format: "stream",
  headers: {},
  timeout: "30s",
  redirects: 3
});

// Change options
client.full(); // Show full response with headers, status, data
client.format(format); // Change the default format for all responses
client.base(base); // Change the base URL for requests
client.port(port); // Set the port it requests on (Default's to protocol)
client.redirects(redirects); // Set the maximum amount of redirects for it to follow
client.size(size); // Set the maximum size for requests
client.timeout(time); // Set the maximum time to wait for a request

// Modify URL parameters
client.query(key, value); // Add a single parameter
client.setQuery(query); // Replace all parameters
client.addQuery(query); // Add multiple parameters
client.delQuery(key); // Delete a parameter

// Modify headers
client.header(key, value); // Add a single header
client.setHeaders(headers); // Replace all headers
client.addHeaders(headers); // Add multiple headers
client.delHeader(key); // Delete a header

// Header shortcuts
client.auth(value); // Shortcut for the authorization header
client.agent(value); // Shortcut for the user-agent header
client.contentType(value); // Shortcut for the content-type header

// All HTTPS methods (Returns request)
client.get(url);
client.put(url);
client.head(url);
client.post(url);
client.patch(url);
client.delete(url);
client.options(url);
```

Request

```js
const request = robert.get("https://api.zeppelin.gg/");

// Change options
client.full(); // Show full response with headers, status, data
client.format(format); // Change the default format for all responses
client.port(port); // Set the port it requests on (Default's to protocol)
client.redirects(redirects); // Set the maximum amount of redirects for it to follow
client.size(size); // Set the maximum size for requests
client.timeout(time); // Set the maximum time to wait for a request

// Modify URL parameters
client.query(key, value); // Add a single parameter
client.setQuery(query); // Replace all parameters
client.addQuery(query); // Add multiple parameters
client.delQuery(key); // Delete a parameter

// Modify headers
client.header(key, value); // Add a single header
client.setHeaders(headers); // Replace all headers
client.addHeaders(headers); // Add multiple headers
client.delHeader(key); // Delete a header

// Header shortcuts
client.auth(value); // Shortcut for the authorization header
client.agent(value); // Shortcut for the user-agent header
client.contentType(value); // Shortcut for the content-type header
request.contentLength(value /* Default's to body length */); // Shortcut for the content-length header

// Set response body
request.formData(formData); // Set's a https://www.npmjs.com/package/form-data object as the request body
request.stream(stream); // Set's a stream as the response body
request.buffer(buffer); // Set's a buffer as the response body
request.text(text); // Set's text as the response body and sets the content-type header to text/raw
request.json(json); // Set's an object as the response body and sets the content-type header to application/json
request.form(form); // Set's an object as the response body and sets the content-type header to application/x-www-form-urlencoded

// Send the request
request.send(format); // Returns Promise<format> with the result (Default is stream)
```

Formats

```js
status; // { code: 200, text: 'OK' }
headers; // { ... }
stream; // Default, can be piped into write stream
buffer; // bufferArray combined into one <Buffer ...>
bufferArray; // Raw chunks from the stream [<Buffer ...>, ...]
text; // Gets the output as a normal string like this
json; // { ... }
arrayBuffer; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
blob; // https://developer.mozilla.org/en-US/docs/Web/API/Blob
```

# Best moments (This section is a joke)

![roasted](https://cdn.discordapp.com/attachments/796997555752796184/884655359912972308/ezgif-3-7ffc8baffe5e.png)