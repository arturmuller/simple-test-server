/* globals test, expect */

const http = require("http");
const listen = require("./listen");

test("Resolves with server instance on `listening` event", async () => {
  const httpServer = http.createServer((req, res) => res.end("OK"));
  expect(listen(httpServer, 0)).resolves.toBeDefined();
  httpServer.close();
});

test("Rejects with error on `error` event", async () => {
  const httpServer1 = http.createServer((req, res) => res.end("OK"));
  const httpServer2 = http.createServer((req, res) => res.end("OK"));

  // Forcing an error by trying to listen on a taken port
  await listen(httpServer1, 10000);
  expect(listen(httpServer2, 10000)).rejects.toBeDefined();

  httpServer1.close();
  httpServer2.close();
});
