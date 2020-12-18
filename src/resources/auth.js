import url from "url";
import nJwt from "njwt";
import redirect from "@polka/redirect";

const parseJWT = (token) => {
  let jwtData;
  try {
    jwtData = nJwt.verify(token, process.env.JWT_SECRET);
  } catch (ignore) {}
  if (jwtData) {
    return {
      token,
      name: jwtData.body.name,
      email: jwtData.body.email,
    };
  } else {
    return false;
  }
};

const authenticate = (req, res, next) => {
  let authenticated = parseJWT(req.cookies.auth_token);
  if (authenticated) {
    req.user = authenticated;
    next();
  } else {
    let redirectUrl = url.format({
      protocol: req.headers["x-forwarded-proto"],
      host: req.headers["x-forwarded-host"],
      pathname: req.path,
      query: req.query,
    });
    res.writeHead(302, {
      Location: `${process.env.AUTH}/azuread/login?redirectUrl=${redirectUrl}`,
      "Content-Type": "text/plain",
      "Content-Length": 0,
    });
    res.end();
  }
};

const logoutUrl = `${process.env.AUTH}/logout`;

export { authenticate, logoutUrl };
