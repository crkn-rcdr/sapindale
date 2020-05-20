import qs from "query-string";
import testManifestData from "./cantaloupe.js";

const upholsteryUrl = process.env.UPHOLSTERY;
const packagingdatabase = "wipmetad";

async function _request(token, path, options, method, payload) {
  let url = [upholsteryUrl, path].join("/");
  if (options) url = `${url}?${qs.stringify(options)}`;

  let fetchOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "appliction/json",
    },
  };
  if (method) fetchOptions.method = method;
  if (payload) fetchOptions.body = JSON.stringify(payload);

  let response = await fetch(url, fetchOptions);
  return await response.json();
}

async function _couch_request(token, path, options, method, payload) {
  let result = await _request(
    token,
    ["couch", path].join("/"),
    options,
    method,
    payload
  );

  return result;
}

async function _api_request(token, path, options, method, payload) {
  let result = await _request(
    token,
    ["api/manifest", path].join("/"),
    options,
    method,
    payload
  );

  return result;
}

async function documents(token, db, options) {
  let result = await _couch_request(
    token,
    [db, "_all_docs"].join("/"),
    options
  );
  return result.rows.filter((row) => !row.key.startsWith("_design"));
}

async function idLookup(token, db, idList) {
  let result = await _couch_request(
    token,
    [db, "_all_docs"].join("/"),
    {},
    "POST",
    {
      keys: idList,
    }
  );
  return result;
}
async function design_doc_views(token) {
  let dbs = await _couch_request(token, "_all_dbs");
  let views = {};
  await Promise.all(
    dbs
      .filter((db) => db[0] !== "_" && db !== "bin")
      .map(async (db) => {
        let ddocs = (
          await _couch_request(token, [db, "_all_docs"].join("/"), {
            startkey: JSON.stringify("_design"),
            endkey: JSON.stringify("_design\uFFEF"),
            include_docs: true,
          })
        ).rows;
        ddocs.map((ddoc) => {
          if (ddoc.doc.views) {
            views[db] = views[db] || {};
            views[db][ddoc.id.substring(8)] = Object.keys(ddoc.doc.views);
          }
        });
      })
  );
  return views;
}

async function view(token, db, ddoc, view, options) {
  if (!options.limit) options.limit = 500;
  let result = await _couch_request(
    token,
    [db, "_design", ddoc, "_view", view].join("/"),
    options
  );
  return result.rows;
}

async function testCantaloupe(id, ctoken, token) {
  let cvs = await _api_request(token, `${id}`);
  let listItems = cvs.canvases;
  var generateList = listItems.map((n) => {
    let constructPath = {};
    constructPath.id = n.id;
    constructPath.label = n.label;
    let path = n.master.url.replace(
      "https://swift.canadiana.ca/v1/AUTH_crkn/repository/",
      ""
    );
    let canvasURL = testManifestData(ctoken, path);
    constructPath.full = canvasURL;
    constructPath.thumbnail = canvasURL;
    return constructPath;
  });
  return {
    label: cvs.label,
    items: generateList,
  };
}

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
  idLookup,
  documents,
  design_doc_views,
  view,
  testCantaloupe,
  packagingfilesystem,
  packagingstatus,
  packagingrequests,
  packagingconfigs
};
