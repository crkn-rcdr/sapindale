const couchUrl = process.env.COUCH;

function view(token, db, ddoc, view, options) {
  let url = new URL([couchUrl, db, "_design", ddoc, "_view", view].join("/"));
  Object.keys(options).forEach(key =>
    url.searchParams.append(key, options[key])
  );
  url.searchParams.append("token", token);
  return fetch(url);
}

export { view };
