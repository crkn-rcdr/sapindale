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

async function smeltqview(token, options) {
  let result = await _couch_request(
    token,
    [dipstagingdatabase, "_design/sync/_view/smeltq"].join("/"),
    options
  );
  return result.rows;
}

  //  Once at a time, waiting for each to return...
  //  Should look into promise-throttle?
  // 'aiplist' is an array of IDs, and 'reqs' is a hash (key is ID) of what to post
  async function updatebasic(token, aiplist, reqs) {
    for (const aip of aiplist) {
      await _couch_request(
        token,
        [dipstagingdatabase, "_design/sync/_update/basic", aip].join("/"),
        {},
        "POST",
        reqs[aip]
      );
    }
  }

export { dipstagingdocs, smeltstatusview, manifestdateview, smeltqview, updatebasic };
