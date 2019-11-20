import qs from "query-string";

var value;
const couchUrl = process.env.COUCH;
var payload;
var metaIdList, content;

async function _request(token, path, options) {
  let url = [couchUrl, path].join("/");
  if (options) url = `${url}?${qs.stringify(options)}`;

  let response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await response.json();
}

async function _requestAll(token, path, content) {
  payload =
    `{
    "keys": [` +
    content +
    `]
  }`;
  let url = [couchUrl, path].join("/");
  /* if (options) url = `${url}?${qs.stringify(options)}`; */

  let response = await fetch(url, {
    method: "POST",
    body: payload,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });
  return await response.json();
}
async function documents(token, db, options) {
  let result = await _request(token, [db, "_all_docs"].join("/"), options);
  console.log("res", result);
  return result.rows.filter(row => !row.key.startsWith("_design"));
}

async function bulkId(token, db, metaIdList) {
  console.log("insideBulk");
  var contentarr = [];
  contentarr = metaIdList.split("\n");
  console.log("Split:-> ", contentarr);
  var arrlength = contentarr.length;
  content = "";
  for (var index = 0; index < arrlength; index++) {
    if (index != arrlength - 1) {
      content = content + '"' + contentarr[index] + '",';
    } else {
      content = content + '"' + contentarr[index] + '"';
    }
    console.log("contentcheck-> ", content);
  }
  let result = await _requestAll(token, [db, "_all_docs"].join("/"), content);
  /* return result.rows.filter(row => !row.key.startsWith("_design")); */
  return result.metaId.filter();
}

async function design_doc_views(token) {
  let dbs = await _request(token, "_all_dbs");
  let views = {};
  await Promise.all(
    dbs
      .filter(db => db[0] !== "_" && db !== "bin")
      .map(async db => {
        let ddocs = (
          await _request(token, [db, "_all_docs"].join("/"), {
            startkey: JSON.stringify("_design"),
            endkey: JSON.stringify("_design\uFFEF"),
            include_docs: true
          })
        ).rows;
        ddocs.map(ddoc => {
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
  let result = await _request(
    token,
    [db, "_design", ddoc, "_view", view].join("/"),
    options
  );
  return result.rows;
}

export { bulkId, documents, design_doc_views, view };
