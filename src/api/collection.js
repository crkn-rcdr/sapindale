import { request } from "../api";

async function getCollection(token, id) {
  return await request(
    token,
    "GET",
    ["collection", `${encodeURIComponent(id)}`].join("/")
  );
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

export { getCollection, resolveSlug, searchSlug };
