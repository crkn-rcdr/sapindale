// from Couch at the moment, later from slug once idea approved...
import { viewResultFromKeys } from "../../resources/couch";

export async function post(req, res) {
  let jsonreturn = false;
  console.log("req.body",req.body);
  if ("slugs" in req.body && Array.isArray(req.body.slugs)) {
    jsonreturn = {};
    req.body.slugs.forEach(function (slug) {
      jsonreturn[slug] = false;
    });
  }
  console.log("manyslug", jsonreturn);
  res.finalizeJSON(jsonreturn);
}
