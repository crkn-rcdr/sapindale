
export async function post(req, res) {
  let jsonreturn = {};
  console.log(req.body);

  res.finalizeJSON(jsonreturn);
}
