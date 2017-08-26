const listen = (server, port) => {
  return new Promise((resolve, reject) => {
    server.on("listening", () => resolve(server));
    server.on("error", error => reject(error));

    server.listen(port);
  });
};

module.exports = listen;
