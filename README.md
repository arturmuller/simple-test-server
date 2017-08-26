# Simple Test Server

> Create simple test server

## Installation

You probably want to install this as a dev dependency...

```sh
npm install -D simple-test-server
```

## Usage

```js
const createTestServer = require("simple-test-server");

const PORT = 8080;
const routes = {
  "/hello": {
    status: 200,
    body: "Hello world!",
    headers: { "content-type": "text/plain" },
  },
  "default": {
    status: 404,
    body: "Not found",
    headers: { "content-type": "text/plain" },
  },
};

// This returns a promise
createTestServer(PORT, routes)

// After the promise returned from createTestServer resolves, requests to
// "/hello" will respond with 200, "Hello world!", with all other requests
// responding with 404, "Not found".

```
