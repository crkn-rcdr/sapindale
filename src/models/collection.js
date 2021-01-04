import { getDocument, viewResultsFromKeys } from "../resources/couch";
import { multiTextValueToSingle } from "../resources/iiif";
import Manifest from "./manifest";
import Slug from "./slug";

async function fetch(id) {
  const loadItems = async function loadItems(items) {
    const itemIds = items.map((item) => item.id);
    const collectionLookup = lookup(itemIds.filter(isValidId));
    const manifestLookup = Manifest.lookup(itemIds.filter(Manifest.isValidId));
    const [collections, manifests] = await Promise.all([
      collectionLookup,
      manifestLookup,
    ]);

    const itemRefs = { ...collections, ...manifests };
    return items.map((item) => {
      return { id: item.id, ...itemRefs[item.id] };
    });
  };

  if (!isValidId(id)) {
    return {
      status: 400,
      content: {},
      message: `${id} is not a valid Collection ID.`,
    };
  }

  const response = await getDocument("collection", id);
  if (response.status === 200) {
    const document = response.content;
    const collection = {
      id,
      slug: document.slug,
      label: multiTextValueToSingle(document.label),
      ordered: document.ordered,
      public: document.public,
      itemCount: document.items.length,
    };
    if (document.summary)
      collection.summary = multiTextValueToSingle(document.summary);
    if (document.ordered) collection.items = await loadItems(document.items);
    return { status: 200, content: collection };
  } else if (response.status === 404) {
    return { status: 404, content: {}, message: `Collection ${id} not found.` };
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
    "collection",
    "access",
    "basic",
    ids
  );
  if (response.status === 200) {
    let collections = {};
    response.content.map((row) => {
      row.value.label = multiTextValueToSingle(row.value.label);
      row.value.type = "collection";
      collections[row.id] = row.value;
    });
    return collections;
  } else {
    return {};
  }
}

function isValidId(id) {
  return id.startsWith("69429/s");
}

async function resolveSlug(id) {
  let response = await Slug.info("collection", id);
  if (response.status === 200) {
    response.content.type = "collection";
  }
  return response;
}

async function searchSlug(prefix, limit = 10) {
  return await Slug.search("collection", prefix, limit);
}

async function getParentsOf(id) {
  const response = await viewResultsFromKeys("collection", "access", "items", [
    id,
  ]);

  if (response.status === 200) {
    return response.content.map((row) => {
      return {
        id: row.id,
        slug: row.value.slug,
        label: multiTextValueToSingle(row.value.label),
      };
    });
  } else {
    return [];
  }
}

export default {
  fetch,
  lookup,
  isValidId,
  resolveSlug,
  searchSlug,
  getParentsOf,
};
