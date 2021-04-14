// from Couch at the moment, later from slug once idea approved...
import { getView } from "../../resources/couch";

// Hard coded at top as config seems fine. Part of review
const dipstagingdatabase = "dipstaging";
const ddoc = "sync";

export async function post(req, res) {
  let jsonreturn = {};
  const response = await getView(
    dipstagingdatabase,
    ddoc,
    req.body.view,
    req.body.options
  );
  if (response.status === 200) {
    jsonreturn = response.content;
  }
  // Return is an empty hash (any error), or a hash where rows is the array of rows returned from CouchDB.
  res.finalizeJSON(jsonreturn);
}
