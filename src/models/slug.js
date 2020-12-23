import { viewResultFromKey, searchView } from "../resources/couch";
import { multiTextValueToSingle } from "../resources/iiif";

async function info(dbName, id) {
  const response = await viewResultFromKey(dbName, "access", "slug", id);
  if (response.status === 200) {
    const slug = response.content;
    return {
      status: 200,
      content: {
        id,
        noid: slug.id,
        label: multiTextValueToSingle(slug.value.label),
        isAlias: slug.value.isAlias,
        aliasOf: slug.value.aliasOf,
      },
    };
  } else if (response.status === 404) {
    return { status: 404, content: {}, message: `Slug ${id} not found.` };
  } else {
    return {
      status: response.status,
      content: {},
      message: response.content.error,
    };
  }
}

async function search(dbName, prefix, limit = 10) {
  return await searchView(dbName, "access", "slug", prefix, limit);
}

export default { info, search };
