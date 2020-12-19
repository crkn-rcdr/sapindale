import qs from "query-string";

const apiUrl = process.env.API;

async function request(token, method, path, options, payload) {
  let url = [apiUrl, path].join("/");
  if (options) url = `${url}?${qs.stringify(options)}`;

  let fetchOptions = {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
  if (payload) fetchOptions.body = JSON.stringify(payload);

  let response = await fetch(url, fetchOptions);
  return await response.json();
}

function removeNoidPrefix(noid) {
  if (noid.substring(0, 6) === "69429/") {
    return noid.substring(6);
  } else {
    return noid;
  }
}

export { request, removeNoidPrefix };
