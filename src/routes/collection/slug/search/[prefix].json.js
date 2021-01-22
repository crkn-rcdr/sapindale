import Slug from "../../../../models/slug";

export async function post(req, res) {
  const prefix = req.params.prefix;
  const response = await Slug.search("collection", prefix);
  res.finalizeJSON(response);
}
