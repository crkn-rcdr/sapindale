import Repository from "../../models/repository";

export async function get(req, res) {
  const repo = req.path;
  const response = await Repository.refreshValues("merged", repo);
  res.finalizeJSON(response);
}
