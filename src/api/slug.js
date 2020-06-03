import { request } from "../api";

async function resolve(token, slug) {
  return await request(token, "GET", ["slug", slug].join("/"));
}

export { resolve };
