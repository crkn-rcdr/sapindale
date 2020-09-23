import { request } from "../api";

async function getManifest(token, manifest) {
  /*  let prefix = encodeURIComponent("69429/"); */
  return await request(token, "GET", ["manifest", manifest].join("/"));
}

async function resolveSlug(token, slug) {
  return await request(token, "GET", ["manifest", "slug", slug].join("/"));
}

async function searchSlug(token, prefix) {
  if (prefix !== "") {
    return await request(
      token,
      "POST",
      ["manifest", "slug", "search", prefix].join("/")
    );
  }
}

export { getManifest, resolveSlug, searchSlug };
