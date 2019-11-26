import qs from "query-string";

const couchUrl = process.env.COUCH;

async function _request(token, path, options, method, payload) {
  let url = [couchUrl, path].join("/");
  if (options) url = `${url}?${qs.stringify(options)}`;

  let fetchOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  };
  if (method) fetchOptions.method = method;
  if (payload) fetchOptions.body = JSON.stringify(payload);

  let response = await fetch(url, fetchOptions);
  return await response.json();
}

async function documents(token, db, options) {
  let result = await _request(token, [db, "_all_docs"].join("/"), options);
  return result.rows.filter(row => !row.key.startsWith("_design"));
}

async function idLookup(token, db, idList) {
  let result = await _request(token, [db, "_all_docs"].join("/"), {}, "POST", {
    keys: idList
  });
  return result;
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

export { idLookup, documents, design_doc_views, view };
