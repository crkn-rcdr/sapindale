import qs from "query-string";
import fetch from "cross-fetch";

const couchUrl = process.env.COUCH;

async function _request(path, options, method, payload) {
  let url = [couchUrl, path].join("/");
  if (options) url = `${url}?${qs.stringify(options)}`;

  let fetchOptions = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  if (method) fetchOptions.method = method;
  if (payload) fetchOptions.body = JSON.stringify(payload);

  let response = await fetch(url, fetchOptions);
  return {
    status: response.status,
    content:
      response.status >= 500
        ? { error: "server_error" }
        : await response.json(),
  };
}

function _buildViewPath(db, ddoc, view) {
  if (ddoc === null && view === "_all_docs") {
    return [db, "_all_docs"].join("/");
  } else {
    return [db, "_design", ddoc, "_view", view].join("/");
  }
}

function _defaultError(response, errorContent = {}) {
  return {
    status: response.status,
    content: errorContent,
    message: response.content.error,
  };
}

async function getDocument(db, id) {
  return await _request([db, encodeURIComponent(id)].join("/"));
}

async function viewResultFromKey(db, ddoc, view, key, includeDocs = false) {
  let response = await _request(_buildViewPath(db, ddoc, view), {
    key: JSON.stringify(key),
    include_docs: includeDocs,
    stale: "ok",
  });
  if (response.status === 200) {
    const rows = response.content.rows;
    if (rows.length > 0) {
      return { status: 200, content: rows[0] };
    } else {
      return { status: 404, content: {}, message: "Key lookup failed." };
    }
  } else {
    return _defaultError(response);
  }
}

async function viewResultsFromKeys(db, ddoc, view, keys) {
  let response = await _request(
    _buildViewPath(db, ddoc, view),
    { stale: "ok" },
    "POST",
    {
      keys,
    }
  );
  if (response.status === 200) {
    return { status: 200, content: response.content.rows };
  } else {
    return _defaultError(response, []);
  }
}

async function searchView(db, ddoc, view, prefix, limit) {
  let response = await _request(
    _buildViewPath(db, ddoc, view),
    {
      start_key: JSON.stringify(prefix),
      end_key: JSON.stringify(`${prefix}\ufff0`),
      limit,
      stale: "ok",
    },
    "GET"
  );
  if (response.status === 200) {
    return {
      status: 200,
      content: response.content.rows.map((row) => row.key),
    };
  } else {
    return _defaultError(response, []);
  }
}

async function update(db, ddoc, update, id) {
  // TODO: build update URL and request it
}

export { getDocument, viewResultFromKey, viewResultsFromKeys, searchView };
