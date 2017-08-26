/* globals test, expect, beforeAll, afterAll */

const createTestServer = require("./index");
const got = require("got");

const PORT = 8080;
const ORIGIN = `http://localhost:${PORT}`;

const routes = {
  "/hello": {
    status: 200,
    body: "Hello world!",
    headers: { "content-type": "text/plain" },
  },
  "/object": {
    status: 200,
    body: { foo: "bar" },
    headers: { "content-type": "application/json" },
  },
  default: {
    status: 404,
    body: "Not found",
    headers: { "content-type": "text/plain" },
  },
};

let server;

beforeAll(async () => {
  server = await createTestServer(PORT, routes);
});

afterAll(() => {
  server.close();
});

test("Validates route config at startup", async () => {
  const fn1 = () => createTestServer(0, {});
  expect(fn1).toThrow(/default/);

  const fn2 = () => createTestServer(0, { default: { status: "nope" } });
  expect(fn2).toThrow(/number/);

  const fn3 = () => createTestServer(0, { default: {} });
  expect(fn3).toThrow(/status/);
});

test("Responds based on a supplied route path", async () => {
  const { body, statusCode, headers } = await got(`${ORIGIN}/hello`);
  expect(statusCode).toBe(200);
  expect(headers["content-type"]).toBe("text/plain");
  expect(body).toBe("Hello world!");
});

test("Falls back to `default` when path is not found", async () => {
  try {
    await got(`${ORIGIN}/unknown`);
  } catch (error) {
    const { body, statusCode, headers } = error.response;
    expect(statusCode).toBe(404);
    expect(headers["content-type"]).toBe("text/plain");
    expect(body).toBe("Not found");
  }
});

test("Stringifies response `body` if passed on object", async () => {
  const options = { json: true };
  const { body, statusCode, headers } = await got(`${ORIGIN}/object`, options);

  expect(statusCode).toBe(200);
  expect(headers["content-type"]).toBe("application/json");
  expect(body).toEqual({ foo: "bar" });
});
