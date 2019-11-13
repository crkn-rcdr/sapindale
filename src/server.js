import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";
import { createServer as https } from "https";
import { createServer as http } from "http";
import { readFileSync } from "fs";
import "./styles/global.css";

const { NODE_ENV, PORT, HTTP_PORT, SSL_DIR, HTTPS } = process.env;
const dev = NODE_ENV === "development";

const { handler } = polka().use(
  compression({ threshold: 0 }),
  sirv("static", { dev }),
  sapper.middleware()
);

if (HTTPS) {
  https(
    {
      cert: readFileSync(SSL_DIR + "/server.crt"),
      key: readFileSync(SSL_DIR + "/server.key")
    },
    handler
  ).listen(PORT);

  http(function(req, res) {
    res.writeHead(301, {
      Location: "https://" + req.headers["host"] + req.url
    });
    res.end();
  }).listen(HTTP_PORT);
} else {
  http(handler).listen(PORT);
}
