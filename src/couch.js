const couchUrl = process.env.COUCH;

function _request(token, path, options) {
  let url = new URL([couchUrl, path].join("/"));
  Object.keys(options).forEach(key =>
    url.searchParams.append(key, options[key])
  );

  return fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(
    response => response.json()
  );
}

function all_docs(token, db, options) {
  return _request(token, [db, "_all_docs"].join("/"), options);
}

function view(token, db, ddoc, view, options) {
  return _request(
    token,
    [db, "_design", ddoc, "_view", view].join("/"),
    options
  );
}

export { view, all_docs };
