import Slug from "../../../models/slug";

export async function get(req, res) {
  const slug = req.params.slug;
  const response = await Slug.info("collection", slug);
  res.finalizeJSON(response);
}
