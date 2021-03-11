import Repository from "../../models/repository";

export async function get(req, res) {
  const repo = req.params.merged;
  const response = await Repository.repoLoad("merged", repo);
  res.finalizeJSON(response);
}
