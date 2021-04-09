import { updateCouch } from "../../resources/couch";

// Hard coded at top as config seems fine. Part of review
const dipstagingdatabase = "dipstaging";

export async function post(req, res) {
  let jsonreturn = {};

  function updateBasic(aip = "", update = {}) {
    return updateCouch(dipstagingdatabase, "sync", "basic", aip, update);
  }

  // One request at a time to not flood CouchDB.
  // Someone can later update this to allow a limited number of concurrent requests.
  for (const aip of Object.keys(req.body)) {
    const data = req.body[aip];
    if (typeof data === "object") {
      switch (data.action) {
        case "smelt":
          await updateBasic(aip, {
            dosmelt: true,
            slug: data.slug,
          });
          break;
        case "clear":
          // TODO: A better server-side update should be created which deletes the `smelt` key
          await updateBasic(aip, {
            smelt: "{}",
          });
          break;
      }
    }
  }

  // We don't currently return anything to indicate success or failure to user.
  res.finalizeJSON(jsonreturn);
}
