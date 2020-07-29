import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";
import { createServer as http } from "http";
import cookieParser from "cookie-parser";
import nJwt from "njwt";
import "./styles/global.css";

const { NODE_ENV, PORT, JWT_SECRET } = process.env;
const dev = NODE_ENV === "development";
const parseJWT = (token) => {
  let jwtData;
  try {
    jwtData = nJwt.verify(token, JWT_SECRET);
  } catch (ignore) {}
  if (jwtData) {
    return {
      token,
      name: jwtData.body.name,
      email: jwtData.body.email,
      authenticated: true,
    };
  } else {
    return { authenticated: false };
  }
};
const { handler } = polka().use(
  cookieParser(),
  compression({ threshold: 0 }),
  sirv("static", { dev }),
  sapper.middleware({
    session: (req, res) => {
      if (req.cookies.auth_token) {
        return parseJWT(req.cookies.auth_token);
      } else {
        return {};
      }
    },
  })
);

http(handler).listen(PORT);
