import url from "url";
import polka from "polka";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import compression from "compression";
import sirv from "sirv";
import { authenticate } from "./resources/auth";

import * as sapper from "@sapper/server";
import { createServer as http } from "http";

import "./styles/global.css";

// this is probably a bad idea, but it'll do for now
import nodeFetch from "node-fetch";
global.fetch = nodeFetch;

const { handler } = polka().use(
  bodyParser.json(),
  bodyParser.raw({
    type: ["text/csv", "application/octet-stream"],
    limit: "50mb",
  }),
  cookieParser(),
  compression({ threshold: 0 }),
  sirv("static", { dev: process.dev }),
  authenticate,
  (req, res, next) => {
    if (req.path.substring(req.path.length - 5) === ".json") {
      res.finalizeJSON = (apiResponse) => {
        res.setHeader("Content-Type", "application/json");
        if ("status" in apiResponse && "content" in apiResponse) {
          res.statusCode = apiResponse.status;
          if (apiResponse.status >= 400) {
            res.end(JSON.stringify({ error: apiResponse.message }));
          } else {
            res.end(JSON.stringify(apiResponse.content));
          }
        } else {
          res.statusCode = 200;
          res.end(JSON.stringify(apiResponse));
        }
      };
    }
    next();
  },
  sapper.middleware({
    session: (req, _res) => {
      return req.user || {};
    },
  })
);

http(handler).listen(process.env.PORT);
