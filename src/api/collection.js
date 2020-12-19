import { request } from "../api";

const noidPrefix = encodeURIComponent("69429/");

async function getCollection(token, id) {
  /*  let prefix = encodeURIComponent("69429/"); */
  return await request(
    token,
    "GET",
    ["collection", `${noidPrefix}${id}`].join("/")
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
