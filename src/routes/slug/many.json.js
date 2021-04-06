// from Couch at the moment, later from slug once idea approved...
import { viewResultsFromKeys } from "../../resources/couch";

export async function post(req, res) {
  let jsonreturn = {};
  if ("slugs" in req.body && Array.isArray(req.body.slugs)) {
    const response = await viewResultsFromKeys(
      "access",
      "access",
      "slug",
      req.body.slugs
    );
    if (response.status === 200 && Array.isArray(response.content)) {
      req.body.slugs.forEach(function (slug) {
        jsonreturn[slug] = null;
      });
      response.content.forEach(function (row) {
        jsonreturn[row.key] = row.id;
      });
    }
  }
  // Return is an empty has (any error), or a hash where key is slug and value is `false` or a string representing the noid.
  res.finalizeJSON(jsonreturn);
}
