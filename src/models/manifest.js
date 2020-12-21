import { getDocument, viewResultsFromKeys } from "../resources/couch";
import { multiTextValueToSingle } from "../resources/iiif";
import Slug from "./slug";

async function fetch(id) {
  // if (!isNoid(id)) {
  //   throw new RequestError(`${id} is not a valid NOID.`);
  // }

  // let document;
  // try {
  //   document = await getDocument("manifest", id);
  // } catch (error) {
  //   throw error.status === 404
  //     ? new NotFoundError(`Manifest ${id} not found.`)
  //     : error;
  // }

  // let rv = {
  //   id,
  //   slug: document.slug,
  //   label: multiTextValueToSingle(document.label),
  //   type: document.type,
  // };

  // if (document.type === "multicanvas") {
  //   rv.canvases = document.canvases;
  // }

  // return rv;
  return {};
}

async function lookup(ids) {
  if (ids.length === 0) return {};

  const response = await viewResultsFromKeys(
    "manifest",
    "access",
    "basic",
    ids
  );
  if (response.status === 200) {
    let manifests = {};
    response.content.map((row) => {
      row.value.label = multiTextValueToSingle(row.value.label);
      row.value.manifestType = row.value.type;
      row.value.type = "manifest";
      manifests[row.id] = row.value;
    });
    return manifests;
  } else {
    return {};
  }
}

async function isNoid(noid) {
  return noid.startsWith("69429/m");
}

async function resolveSlug(id) {
  let response = await Slug.info("manifest", id);
  if (response.status === 200) {
    response.content.type = "manifest";
  }
  return response;
}

async function searchSlug(prefix, limit = 10) {
  return await Slug.search(DB_NAME, prefix, limit);
}

async function unpublish(id) {
  // TODO: call the unpublish update
}

export default {
  // fetch,
  lookup,
  isNoid,
  resolveSlug,
  searchSlug,
};
