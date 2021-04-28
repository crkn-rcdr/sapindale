import { updateCouch, getView, postView } from "../resources/couch";

// Hard coded at top as config seems fine. Part of review
const internalmetadatabase = "internalmeta";
const capcollectiondatabase = "cap_collections";

// These actions are based on the CouchDB requests previously made via Upholstery.

// If this was designed in the context of having server-side logic, an appropriate
// abstraction should be used so that the visual interface doesn't need to be concerned
// with what database the data for its requests are coming from.

//  Hopefully the old access platform will go away before anyone thinks about doing a refactor.

export async function post(req, res) {
  let jsonreturn = [];

  switch (req.body.action) {
    case "collections":
      const response = await getView(capcollectiondatabase, null, "_all_docs", {
        include_docs: true,
      });
      if (response.status === 200) {
        jsonreturn = response.content.rows;
      }
      break;

    case "docs":
      if ("docs" in req.body && Array.isArray(req.body.docs)) {
        const response = await postView(
          internalmetadatabase,
          null,
          "_all_docs",
          {
            include_docs: true,
          },
          { keys: req.body.docs }
        );
        if (response.status === 200) {
          jsonreturn = response.content.rows;
        }
      }
      break;

    case "requests":
      for (const aip of req.body.aiplist) {
        await updateCouch(
          internalmetadatabase,
          "tdr",
          "basic",
          aip,
          req.body.req
        );
      }
      break;

    default:
      console.log("action not recognized");
  }

  // We don't currently return anything to indicate success or failure to user.
  res.finalizeJSON(jsonreturn);
}
