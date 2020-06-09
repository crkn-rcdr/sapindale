import { request } from "../api";

async function resolve(token, slug) {
  return await request(token, "GET", ["slug", slug].join("/"));
}

async function search(token, prefix) {
  if (prefix !== "") {
    return await request(token, "POST", ["slug", "search", prefix].join("/"));
  }
}
export { resolve, search };
