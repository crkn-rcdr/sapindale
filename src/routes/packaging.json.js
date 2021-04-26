import { updateCouch, getView, postView } from "../resources/couch";

// Hard coded at top as config seems fine. Part of review
const packagingdatabase = "wipmeta";

export async function post(req, res) {
  let jsonreturn = {};

  function updateBasic(aip = "", update = {}) {
    return updateCouch(packagingdatabase, "sync", "basic", aip, update);
  }

  switch (req.body.action) {
    case "filesystem":
      console.log("filesystem");
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
      console.log("status");
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
      console.log("configs");
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
      console.log("docs");
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
      console.log("requests");
      break;

    default:
      console.log("action not recognized");
  }

  // We don't currently return anything to indicate success or failure to user.
  res.finalizeJSON(jsonreturn);
}
