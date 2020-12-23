import Slug from "../../../../models/slug";

export async function post(req, res) {
  const slug = req.params.slug;
  const response = await Slug.available(slug);
  res.finalizeJSON(response);
}
