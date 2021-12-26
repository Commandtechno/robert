![Logo](https://cdn.discordapp.com/emojis/843908573578002512.gif)

utilities for `robert` and `robert-server`

# Usage

```js
// CommonJS
const utils = require("robert-utils");

// Typescript / ES2019
import * as utils from "robert-utils";
```

# Time and size

```js
// parse time to milliseconds
utils.parseTime("1m"); // 60000

// parse size to bytes
utils.parseSize("1kb"); // 1024
```

# Parsing

all functions take an http incoming message, and a maxSize (number) parameter

```js
utils.toBuffers(); // Array of buffers
utils.toBuffer(); // Buffer
utils.toArrayBuffer(); // ArrayBuffer instance
utils.toBlob(); // Blob with the content-type already set
utils.toString(); // String
utils.toJSON(); // Object
```