import Repository from "../../models/repository";

export async function get(req, res) {
  const repo = req.params;
  const response = await Repository.refreshValues("merged", repo);
  res.finalizeJSON(response);
}
