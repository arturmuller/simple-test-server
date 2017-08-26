const http = require("http");
const assert = require("assert");
const listen = require("./listen");

const validateRoutes = routes => {
  assert.ok(routes.default, "Route object is missing `default` prop");

  for (const path in routes) {
    const response = routes[path];
    assert.ok(response.status, "Response has to include `status`");
    assert.equal(typeof response.status, "number", "Status has to be a number");
  }
};

const createTestServer = (port, routes) => {
  validateRoutes(routes);

  const server = http.createServer((req, res) => {
    const { status, headers, body } = routes[req.url] || routes.default;

    res.writeHead(status, headers);
    res.end(typeof body === "object" ? JSON.stringify(body) : body);
  });

  return listen(server, port);
};

module.exports = createTestServer;
