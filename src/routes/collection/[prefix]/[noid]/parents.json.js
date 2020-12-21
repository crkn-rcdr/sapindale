import Collection from "../../../../models/collection";

export async function get(req, res) {
  const id = `${req.params.prefix}/${req.params.noid}`;
  res.finalizeJSON(await Collection.getParentsOf(id));
}
