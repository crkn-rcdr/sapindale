import { updateCouch, getView, postView } from "../resources/couch";

// Hard coded at top as config seems fine. Part of review
const packagingdatabase = "wipmeta";

// These actions are based on the CouchDB requests previously made via Upholstery.

// If this was designed in the context of having server-side logic, an appropriate
// abstraction should be used so that the visual interface doesn't need to be concerned
// with what database the data for its requests are coming from.

//  Hopefully the old preservation platform will go away before anyone thinks about doing a refactor.

export async function post(req, res) {
  let jsonreturn = {};

  function updateBasic(aip = "", update = {}) {
    return updateCouch(packagingdatabase, "sync", "basic", aip, update);
  }

  switch (req.body.action) {
    case "filesystem":
      {
        const response = await getView(
          packagingdatabase,
          "tdr",
          "filesystem",
          req.body.options
        );
        if (response.status === 200) {
          jsonreturn = response.content.rows;
        }
      }
      break;

    case "status":
      {
        const response = await getView(
          packagingdatabase,
          "tdr",
          "processs",
          req.body.options
        );
        if (response.status === 200) {
          jsonreturn = response.content.rows;
        }
      }
      break;

    case "configs":
      {
        const response = await getView(
          packagingdatabase,
          "tdr",
          "configs",
          req.body.options
        );
        if (response.status === 200) {
          jsonreturn = response.content.rows;
        }
      }
      break;

    case "docs":
      if ("docs" in req.body && Array.isArray(req.body.docs)) {
        const response = await postView(
          packagingdatabase,
          null,
          "_all_docs",
          req.body.options,
          { keys: req.body.docs }
        );
        if (response.status === 200) {
          jsonreturn = response.content.rows;
        }
      }
      break;

    case "requests":
      console.log("requests", req.body);
      for (const aip of req.body.aiplist) {
        await updateCouch(
          packagingdatabase,
          "tdr",
          "basic",
          aip,
          req.body.reqs
        );
      }
      break;

    default:
      console.log("action not recognized");
  }

  // We don't currently return anything to indicate success or failure to user.
  res.finalizeJSON(jsonreturn);
}
