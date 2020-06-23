import { request } from "../api";

// TODO: ask Divya to rename this
async function collectionrequest(token, collection) {
  /*  let prefix = encodeURIComponent("69429/"); */
  return await request(token, "GET", ["collection", collection].join("/"));
}

async function resolveSlug(token, slug) {
  return await request(token, "GET", ["collection", "slug", slug].join("/"));
}

async function searchSlug(token, prefix) {
  if (prefix !== "") {
    return await request(
      token,
      "POST",
      ["collection", "slug", "search", prefix].join("/")
    );
  }
}

export { collectionrequest, resolveSlug, searchSlug };
