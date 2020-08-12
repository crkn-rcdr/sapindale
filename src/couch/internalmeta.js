import { _request as couchRequest } from "../couch.js";

const internalmetadatabase = "internalmeta";
const capcollectiondatabase = "cap_collections";

async function internalmetadocs(token, docs, options) {
  let result = await couchRequest(
    token,
    [internalmetadatabase, "_all_docs"].join("/"),
    options,
    "POST",
    { keys: docs }
  );
  return result.rows;
}

//  One at a time, waiting for each to return...
//  Should look into promise-throttle?
async function internalmetarequests(token, aiplist, req) {
  for (const aip of aiplist) {
    await couchRequest(
      token,
      [internalmetadatabase, "_design/tdr/_update/basic", aip].join("/"),
      {},
      "POST",
      req
    );
  }
}

async function capcollectiondocs(token, options) {
  let result = await couchRequest(
    token,
    [capcollectiondatabase, "_all_docs"].join("/"),
    options
  );
  return result.rows;
}

export { internalmetadocs, internalmetarequests, capcollectiondocs };
