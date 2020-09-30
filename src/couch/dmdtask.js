import { _request as couchRequest, _fetch as couchFetch } from "../couch.js";

export const dmdtaskdatabase = "dmdtask";

async function newid(token) {
  let uuids = await couchRequest(token, "_uuids", { count: 1 }, "GET");
  if (!Array.isArray(uuids.uuids)) {
    return;
  }
  let uuid = uuids.uuids.pop();

  let ret = await couchRequest(
    token,
    [dmdtaskdatabase, "_design/access/_update/new", uuid].join("/"),
    {},
    "POST"
  );
  if (!("success" in ret)) {
    return;
  }
  return uuid;
}

async function updatedoc(token, docid, thisupdate) {
  return await couchRequest(
    token,
    [dmdtaskdatabase, "_design/access/_update/update", docid].join("/"),
    {},
    "POST",
    thisupdate
  );
}

async function getdoc(token, docid) {
  return await couchRequest(
    token,
    [dmdtaskdatabase, docid].join("/"),
    {},
    "GET"
  );
}

async function uploadAttach(token, docid, rev, file) {
  if (!docid || !rev || !file.name) {
    alert("Missing information for upload");
    return;
  }
  let response = await couchFetch(
    token,
    [dmdtaskdatabase, docid, file.name].join("/"),
    { "If-Match": rev, "Content-Type": file.type },
    undefined,
    "PUT",
    file
  );
  if (response.status !== 201) {
    alert("Problem uploading attachment for " + docid);
    return;
  } else {
    return true;
  }
}

export { newid, updatedoc, getdoc, uploadAttach };
