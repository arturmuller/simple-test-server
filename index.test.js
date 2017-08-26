/* globals test, expect, beforeAll, afterAll */

const createTestServer = require("./index");
const got = require("got");

const PORT = 8080;
const routes = {
  "/hello": {
    status: 200,
    body: "Hello world!",
    headers: { accept: "text/plain" },
  },
  default: {
    status: 404,
    body: "Not found",
    headers: { accept: "text/plain" },
  },
};

let server;

beforeAll(async () => {
  server = await createTestServer(PORT, routes);
});

afterAll(() => {
  server.close();
});

test("Should respond based on correct path", async () => {
  const { body, statusCode, headers } = await got(`localhost:${PORT}/hello`);
  expect(statusCode).toBe(200);
  expect(headers.accept).toBe("text/plain");
  expect(body).toBe("Hello world!");
});

test("Should fall back to default on unknown route", async () => {
  try {
    await got(`localhost:${PORT}/unknown`);
  } catch (error) {
    const { body, statusCode, headers } = error.response;
    expect(statusCode).toBe(404);
    expect(headers.accept).toBe("text/plain");
    expect(body).toBe("Not found");
  }
});
