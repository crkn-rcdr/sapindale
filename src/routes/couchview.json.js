import { getView } from "../resources/couch";

// List of databases which we allow viewing of.
let dbs = [
  "access",
  "canvas",
  "cap_collections",
  "cap_logfile_registry",
  "cap_usage_stats",
  "copresentation2",
  "cosearch2",
  "dipstaging",
  "dmdtask",
  "externalmeta",
  "extrameta",
  "parl_session",
  "tdrepo",
  "wipmeta",
];


// CouchView is very tied to CouchDB, and may not be kept long-term, so no abstraction of the interface was done.

export async function post(req, res) {
  let jsonreturn = {};

  switch (req.body.action) {
    case "getviews":
      {
        await Promise.all(
          dbs.map(async (db) => {
            const response = await getView(db, null, "_all_docs", {
              startkey: JSON.stringify("_design"),
              endkey: JSON.stringify("_design\uFFEF"),
              include_docs: true,
            });

            if (response.status === 200) {
              let ddocs = response.content.rows;
              ddocs.map((ddoc) => {
                if (ddoc.doc.views) {
                  jsonreturn[db] = jsonreturn[db] || {};
                  jsonreturn[db][ddoc.id.substring(8)] = Object.keys(
                    ddoc.doc.views
                  );
                }
              });
            }
          })
        );
      }
      break;

    case "fetchview":
      {
        const response = await getView(
          req.body.db,
          req.body.ddoc,
          req.body.view,
          req.body.options
        );
        if (response.status === 200) {
          jsonreturn = response.content.rows;
        }
      }
      break;

    default:
      console.log("couchview.json action not recognized");
  }

  // We don't currently return anything to indicate success or failure to user.
  res.finalizeJSON(jsonreturn);
}
