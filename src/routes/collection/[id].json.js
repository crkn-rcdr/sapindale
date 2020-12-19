import { getCollection } from "../../api/collection";

export async function get(req, res, next) {
  const token = req.cookies.auth_token;
  const { id } = req.params;

  const collection = await getCollection(token, id);

  res.statusCode = collection.status || 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(collection));
}
