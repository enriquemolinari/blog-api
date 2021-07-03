"use strict";

const Hapi = require("@hapi/hapi");
const pages = require("./db/pages.json");

const init = async () => {
  const server = Hapi.server({
    port: 4567,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route({
    method: "GET",
    path: "/page/{id}",
    handler: (request, h) => {
      return pages.filter((page) => {
        return page._id.$oid === `${request.params.id}`;
      });
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
