import qs from "query-string";
import fetch from "cross-fetch";

const couchUrl = process.env.COUCH;

/**
 * @typedef {{
 *   status: number,
 *   content: any,
 *   message?: string
 * }} SapindaleResponse
 */

/**
 * Makes a CouchDB request.
 * @param {string} path Request path.
 * @param {Record<string,string>} options Request query string options.
 * @param {string} [method="GET"] HTTP method for the request.
 * @param {any} [payload] For POST and PUT requests, the request payload. Passed through JSON.stringify.
 * @returns {SapindaleResponse} The response content, if the fetch was successful (i.e. status < 500), and a generic error message if it wasn't.
 */
async function _request(path, options, method = "GET", payload) {
  let url = [couchUrl, path].join("/");
  if (options) url = `${url}?${qs.stringify(options)}`;

  const fetchOptions = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  if (method) fetchOptions.method = method;
  if (payload) fetchOptions.body = JSON.stringify(payload);

  const response = await fetch(url, fetchOptions);

  const rv = { status: response.status };
  if (response.status >= 500) {
    rv.content = null;
    rv.message = "server_error";
  } else {
    rv.content = await response.json();
  }
  return rv;
}

function _buildViewPath(db, ddoc, view) {
  if (ddoc === null && view === "_all_docs") {
    return [db, "_all_docs"].join("/");
  } else {
    return [db, "_design", ddoc, "_view", view].join("/");
  }
}

function _buildUpdatePath(db, ddoc, view, id) {
  return [db, "_design", ddoc, "_update", view, id].join("/");
}
/**
 * Returns a default error response for a request that has failed on the
 * CouchDB endpoint.
 * @param {SapindaleResponse} response The CouchDB response, wrapped in a SapindaleResponse object.
 * @returns {SapindaleResponse} The response to return to the user.
 */
// TODO: What if `response.content` is null?
function _defaultError(response) {
  return {
    status: response.status,
    content: null,
    message: response.content.error,
  };
}

async function getDocument(db, id) {
  return await _request([db, encodeURIComponent(id)].join("/"));
}

// Returns an array of UUIDs or 
async function getUUID(count=1) {
  const response = await _request("_uuids", {count: count});
  if (response.status === 200) {
    return response.content.uuids;
  }
}

/**
 * Returns the results of a view request.
 * @param {string} db The database being queried.
 * @param {string} ddoc The design doc containing the view.
 * @param {string} view The name of the view.
 * @param {Record<string,string>?} options Options to be passed to the view
 * request's query string.
 * @returns {SapindaleResponse} An object wrapping the response content or error.
 */
async function getView(db, ddoc, view, options) {
  const path = _buildViewPath(db, ddoc, view);
  const response = await _request(path, options, "GET");
  if (response.status < 400) {
    return response;
  } else {
    return _defaultError(response);
  }
}

async function postView(db, ddoc, view, options, payload) {
  const path = _buildViewPath(db, ddoc, view);
  const response = await _request(path, options, "POST", payload);
  if (response.status < 400) {
    return response;
  } else {
    return _defaultError(response);
  }
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

async function updateCouch(db, ddoc, update, id, payload = {}) {
  let response = await _request(
    _buildUpdatePath(db, ddoc, update, id),
    {},
    "POST",
    payload
  );
  if (response.status === 200) {
    return { status: 200, content: response.content };
  } else {
    return _defaultError(response, []);
  }
}

export {
  getDocument,
  getView,
  postView,
  viewResultFromKey,
  viewResultsFromKeys,
  searchView,
  updateCouch,
  getUUID
};
