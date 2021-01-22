import Collection from "../../../../models/collection";

export async function get(req, res) {
  const id = `${req.params.prefix}/${req.params.noid}`;
  const response = await Collection.fetch(id);
  res.finalizeJSON(response);
}
