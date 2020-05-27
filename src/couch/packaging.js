import { _couch_request } from "../couch.js";

const packagingdatabase = "wipmetad";

async function packagingfilesystem(token, options) {
    let result = await _couch_request(
      token,
      [packagingdatabase, "_design/tdr/_view/filesystem"].join("/"),
      options
    );
    return result.rows;
  }
  
  async function packagingstatus(token, options) {
    let result = await _couch_request(
      token,
      [packagingdatabase, "_design/tdr/_view/processs"].join("/"),
      options
    );
    return result.rows;
  }
  
  async function packagingconfigs(token, options) {
    let result = await _couch_request(
      token,
      [packagingdatabase, "_design/tdr/_view/configs"].join("/"),
      options
    );
    return result.rows;
  }
  
  async function packagingdocs(token, docs, options) {
    let result = await _couch_request(
      token,
      [packagingdatabase, "_all_docs"].join("/"),
      options,
      "POST",
      { "keys": docs }
    );
    return result.rows;
  }
  
  
  //  Once at a time, waiting for each to return...
  //  Should look into promise-throttle?
  async function packagingrequests(token, aiplist, reqs) {
    for (const aip of aiplist) {
      await _couch_request(
        token,
        [packagingdatabase, "_design/tdr/_update/basic", aip].join("/"),
        {},
        "POST",
        reqs
      );
    }
  }
  
  
  export {
    packagingfilesystem,
    packagingstatus,
    packagingrequests,
    packagingconfigs,
    packagingdocs
  };
  