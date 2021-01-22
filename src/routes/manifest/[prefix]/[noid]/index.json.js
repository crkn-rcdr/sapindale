import Manifest from "../../../../models/manifest";

export async function get(req, res) {
  const id = `${req.params.prefix}/${req.params.noid}`;
  const response = await Manifest.fetch(id);
  res.finalizeJSON(response);
}
