import { _couch_request } from "../couch.js";

const dipstagingdatabase = "dipstaging";

async function dipstagingdocs(token, docs, options) {
    let result = await _couch_request(
      token,
      [dipstagingdatabase, "_all_docs"].join("/"),
      options,
      "POST",
      { "keys": docs }
    );
    return result.rows;
  }
    
  export { dipstagingdocs };