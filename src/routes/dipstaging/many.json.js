// from Couch at the moment, later from slug once idea approved...
import { postView } from "../../resources/couch";

// Hard coded at top as config seems fine. Part of review
const dipstagingdatabase = "dipstaging";

export async function post(req, res) {
  let jsonreturn = {};
  if ("keys" in req.body && Array.isArray(req.body.keys)) {
    const response = await postView(
      dipstagingdatabase,
      null,
      "_all_docs",
      req.body.options,
      { keys: req.body.keys }
    );
    if (response.status === 200) {
      jsonreturn = response.content;
    }
  }
  // Return is an empty hash (any error), or a hash where rows is the array of rows returned from CouchDB.
  res.finalizeJSON(jsonreturn);
}