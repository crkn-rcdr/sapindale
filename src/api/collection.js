import { request } from "../api";

async function collectionrequest(token, collection) {
  /*  let prefix = encodeURIComponent("69429/"); */
  return await request(token, "GET", ["collection", collection].join("/"));
}

export { collectionrequest };
