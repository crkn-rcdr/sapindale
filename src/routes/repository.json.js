import Repository from "../models/repository";

export async function get(req, res) {
  const response = await Repository.load();
  res.finalizeJSON(response);
}
