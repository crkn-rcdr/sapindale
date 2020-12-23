import { viewResultFromKey, searchView } from "../resources/couch";
import { multiTextValueToSingle } from "../resources/iiif";

async function available(slug) {
  const [manifestResponse, collectionResponse] = await Promise.all([
    info("manifest", slug),
    info("collection", slug),
  ]);
  return {
    status: 200,
    content: Object.assign(
      {},
      manifestResponse.content,
      collectionResponse.content
    ),
  };
}

async function info(dbName, slug) {
  const response = await viewResultFromKey(dbName, "access", "slug", slug);
  const content = response.content;
  if (response.status === 200) {
    return {
      status: 200,
      content: {
        id: content.id,
        slug,
        label: multiTextValueToSingle(content.value.label),
        type: dbName,
        isAlias: content.value.isAlias,
        aliasOf: content.value.aliasOf,
      },
    };
  } else if (response.status === 404) {
    return {
      status: 404,
      content: {},
      message: `Slug ${slug} not found.`,
    };
  } else {
    return {
      status: response.status,
      content: {},
      message: content.error,
    };
  }
}

async function search(dbName, prefix, limit = 10) {
  return await searchView(dbName, "access", "slug", prefix, limit);
}

export default { available, info, search };
