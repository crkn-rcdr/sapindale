import { getView } from "../resources/couch";

// Currently allows any 'db' to be referenced.  In the future we may want to abstract that to ID types
// (IE:  AIPID, noid, slug)
export async function post(req, res) {
  let jsonreturn = [];
  try {
    const response = await getView(req.body.db, null, "_all_docs", {
      startkey: JSON.stringify(req.body.value),
      endkey: JSON.stringify(`${req.body.value}\uFFEF`),
      limit: 12,
    });
    if (response.status === 200) {

      jsonreturn = response.content.rows.map((row) => row.id).filter((element) => !element.startsWith("_design"));
    }
  } catch (ignore) {}

  // We currently return [] for failure as well as empty.
  res.finalizeJSON(jsonreturn);
}
