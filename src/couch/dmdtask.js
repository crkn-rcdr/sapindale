import { _request as couchRequest } from "../couch.js";

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

export { newid, updatedoc, getdoc };
