import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";
import { createServer as http } from "http";
import "./styles/global.css";

const { NODE_ENV, PORT } = process.env;
const dev = NODE_ENV === "development";

const { handler } = polka().use(
  compression({ threshold: 0 }),
  sirv("static", { dev }),
  sapper.middleware()
);

http(handler).listen(PORT);
