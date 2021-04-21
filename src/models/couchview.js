import { getView } from "../resources/couch";

const db = "access";
const ddoc = "";

const views = async () => {
  const response = await getView(db, ddoc, "", {
    reduce: false,
    limit: 10,
    startkey: JSON.stringify(startkey),
    endkey: JSON.stringify(endkey),
  });
  if (response.status === 200) {
    /*  for (const row of response.content.rows) {
         
       } */
    console.log("response-+-+-+", response);
  } else {
    console.log("check else");
  }
};

export default { views };
