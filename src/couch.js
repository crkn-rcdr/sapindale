import qs from "query-string";

const couchUrl = process.env.COUCH;

async function _request(token, path, options) {
  let url = [couchUrl, path].join("/");
  if (options) url = `${url}?${qs.stringify(options)}`;

  let response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await response.json();
}

async function databases(token) {
  return await _request(token, "_all_dbs");
}

async function documents(token, db, options) {
  let result = await _request(token, [db, "_all_docs"].join("/"), options);
  return result.rows.filter(row => !row.key.startsWith("_design"));
}

async function design_docs(token, db) {
  let result = await _request(token, [db, "_all_docs"].join("/"), {
    startkey: JSON.stringify("_design"),
    endkey: JSON.stringify("_design\uFFEF")
  });
  return result.rows;
}

async function design_doc_views(token, db, ddoc) {
  if (ddoc.substring(0, 8) !== "_design") ddoc = `_design/${ddoc}`;
  return (await _request(token, [db, ddoc].join("/"))).views || {};
}

async function view(token, db, ddoc, view, options) {
  let result = await _request(
    token,
    [db, "_design", ddoc, "_view", view].join("/"),
    options
  );
  return result.rows;
}

export { databases, documents, design_docs, design_doc_views, view };
