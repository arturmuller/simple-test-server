const http = require("http");
const assert = require("assert");

const createTestServer = (port, routes) => {
  assert.ok(routes.default, "Route object is missing `default` prop");

  const handler = (req, res) => {
    const { status, body, headers } = routes[req.url] || routes.default;
    res.writeHead(status, headers);
    res.end(body);
  };

  return new Promise((resolve, reject) => {
    const server = http.createServer(handler);
    server.on("listening", () => resolve(server));
    server.on("error", reject);

    server.listen(port);
  });
};

module.exports = createTestServer;
