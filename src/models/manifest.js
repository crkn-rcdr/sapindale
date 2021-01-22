import { getDocument, viewResultsFromKeys } from "../resources/couch";
import { multiTextValueToSingle } from "../resources/iiif";
import Slug from "./slug";

async function fetch(id) {
  if (!isValidId(id)) {
    return {
      status: 400,
      content: {},
      message: `${id} is not a valid Manifest ID.`,
    };
  }

  const response = await getDocument("manifest", id);
  if (response.status === 200) {
    const document = response.content;
    const manifest = {
      id,
      slug: document.slug,
      label: multiTextValueToSingle(document.label),
      type: document.type,
      public: document.public,
    };
    if (document.ordered) collection.items = await loadItems(document.items);
    if (document.type === "multicanvas") {
      manifest.canvases = document.canvases.map((canvas) => {
        return { id: canvas.id, label: multiTextValueToSingle(canvas.label) };
      });
    }
    return { status: 200, content: manifest };
  } else if (response.status === 404) {
    return { status: 404, content: {}, message: `Manifest ${id} not found.` };
  } else {
    return {
      status: response.status,
      content: {},
      message: response.content.error,
    };
  }
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

async function isValidId(id) {
  return id.startsWith("69429/m");
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
  fetch,
  lookup,
  isValidId,
  resolveSlug,
  searchSlug,
};
