import CouchView from "../../models/couchview";

export async function get(req, res) {
  const response = await CouchView.load();
  if (response.status === 200) {
    console.log("response-><-", response);
  } else {
    this.error(response.status, response.error);
  }
  res.finalizeJSON(response);
}
