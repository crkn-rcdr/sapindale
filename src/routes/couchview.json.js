import { getView } from "../resources/couch";

export async function post(req, res) {
  let db;
  let ddoc;
  let jsonreturn = {};
  const response = await getView(
    req.body.db,
    req.body.ddoc,
    req.body.view,
    req.body.options
  );
  if (response.status === 200) {
    jsonreturn = response.content;
  }
  console.log("response +_+_+_+", jsonreturn);
  res.finalizeJSON(jsonreturn);
}
