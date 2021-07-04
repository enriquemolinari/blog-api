"use strict";

const Hapi = require("@hapi/hapi");
const pages = require("./db/pages.json");
const posts = require("./db/posts.json");

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

  /* page by id */
  server.route({
    method: "GET",
    path: "/pages/{id}",
    handler: (request, h) => {
      return pages.filter((page) => {
        return page._id.$oid === `${request.params.id}`;
      });
    },
  });

  /* search */
  server.route({
    method: "GET",
    path: "/search/{text}",
    handler: (request, h) => {
      return posts.filter((post) => {
        return (
          post.title
            .toLowerCase()
            .includes(`${request.params.text}`.toLowerCase()) ||
          post.text
            .toLowerCase()
            .includes(`${request.params.text}`.toLowerCase())
        );
      });
    },
  });

  /* gropus by author */
  server.route({
    method: "GET",
    path: "/byauthor",
    handler: (request, h) => {
      let result = posts.reduce((total, value) => {
        total[value.author] = (total[value.author] || 0) + 1;
        return total;
      }, {});

      return Object.entries(result).map((item) => {
        return { _id: item[0], count: item[1] };
      });
    },
  });

  /* post by id */
  server.route({
    method: "GET",
    path: "/posts/{id}",
    handler: (request, h) => {
      return posts.filter((post) => {
        return post._id.$oid === `${request.params.id}`;
      });
    },
  });

  /* post by author name */
  server.route({
    method: "GET",
    path: "/posts/author/{name}",
    handler: (request, h) => {
      return posts.filter((post) => {
        return (
          post.author.toLowerCase() === `${request.params.name}`.toLowerCase()
        );
      });
    },
  });

  /* latest 4 post */
  server.route({
    method: "GET",
    path: "/posts/latest",
    handler: (request, h) => {
      let ordered = posts.sort((a, b) => {
        return new Date(b.date.$date) - new Date(a.date.$date);
      });

      let result = [];
      ordered.slice(0, 4).map((element) => {
        result.push({
          _id: { $oid: element._id.$oid },
          title: element.title,
          resume: element.resume,
        });
      });
      return result;
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
