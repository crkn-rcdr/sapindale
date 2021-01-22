import url from "url";
import polka from "polka";
import cookieParser from "cookie-parser";
import compression from "compression";
import sirv from "sirv";
import { authenticate } from "./resources/auth";

import * as sapper from "@sapper/server";
import { createServer as http } from "http";

import "./styles/global.css";

// this is probably a bad idea, but it'll do for now
import nodeFetch from "node-fetch";
global.fetch = nodeFetch;

const { NODE_ENV, PORT } = process.env;
const dev = NODE_ENV === "development";

const { handler } = polka().use(
  cookieParser(),
  compression({ threshold: 0 }),
  sirv("static", { dev }),
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

http(handler).listen(PORT);
