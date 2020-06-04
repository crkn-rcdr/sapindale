import { _couch_request } from "../couch.js";

const dipstagingdatabase = "dipstaging";

async function dipstagingdocs(token, docs, options) {
  let result = await _couch_request(
    token,
    [dipstagingdatabase, "_all_docs"].join("/"),
    options,
    "POST",
    { keys: docs }
  );
  return result.rows;
}

async function smeltstatusview(token, options) {
  let result = await _couch_request(
    token,
    [dipstagingdatabase, "_design/sync/_view/smelts"].join("/"),
    options
  );
  return result.rows;
}

async function manifestdateview(token, options) {
  let result = await _couch_request(
    token,
    [dipstagingdatabase, "_design/sync/_view/manifestdate"].join("/"),
    options
  );
  return result.rows;
}


export { dipstagingdocs, smeltstatusview, manifestdateview };
