import { updateCouch, getUUID, postView } from "../resources/couch";

// Hard coded at top as config seems fine. Part of review
const database = "dmdtask";

// Put is used for the attachment
export async function put(req, res) {
  let jsonreturn = {};

  if (Buffer.isBuffer(req.body)) {
    console.log(req.headers);
  } else {
    console.log(
      "Post wasn't a buffer -- likely unknown file type: ",
      req.headers
    );
  }
  // We don't currently return anything to indicate success or failure to user.
  res.finalizeJSON(jsonreturn);
}

// Post is used for other interactions with the client.
export async function post(req, res) {
  let jsonreturn = {};

  switch (req.body.action) {
    case "newid":
      let uuid = await getUUID(5);
      if (Array.isArray(uuid)) {
        let newid = uuid.pop();

        const response = await updateCouch(database, "access", "new", newid);
        if (response.status === 201) {
          jsonreturn = { newid: newid };
        }
      }
      break;

    case "updatedoc":
      {
        await updateCouch(
          database,
          "access",
          "update",
          req.body.id,
          req.body.update
        );
        // No response used at this point.
      }
      break;

    case "getdoc":
      {
        const response = await postView(
          database,
          null,
          "_all_docs",
          {
            include_docs: true,
          },
          { keys: [req.body.id] }
        );
        if (response.status === 200 && Array.isArray(response.content.rows)) {
          let thisdoc = response.content.rows.pop();
          if (thisdoc && "doc" in thisdoc) {
            jsonreturn = thisdoc.doc;
          }
        }
      }
      break;

    default:
      console.log("action not recognized");
  }

  // We don't currently return anything to indicate success or failure to user, only {} 
  res.finalizeJSON(jsonreturn);
}
