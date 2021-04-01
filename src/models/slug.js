import { viewResultFromKey, searchView } from "../resources/couch";

export async function inUse(slug) {
  const response = await viewResultFromKey(
    "access",
    "access",
    "slug",
    slug,
    false
  );
  return { status: 200, content: response.content.id || null };
}

export async function search(prefix, limit = 10) {
  return await searchView("access", "access", "slug", prefix, limit);
}

export default { inUse, search };
