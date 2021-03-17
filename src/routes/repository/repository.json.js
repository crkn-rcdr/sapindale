import Repository from "../../models/repository";

export async function get(req, res) {
  const repo = req.params.merged;
  console.log("hello");
  const response = await Repository.repoLoad("merged", repo);
  console.log("---", response);
  res.finalizeJSON(response);
}
