import qs from "query-string";
import testdata from "./couch/testManifest.json";
const cantaloupeUrl = process.env.CANTALOUPE;
var Jdata = testdata;

function testManifestData(token, identifier, format) {
  var size = Jdata[identifier].master.size;
  console.log("identifier", size);
  let url = encodeURIComponent(
    Jdata[identifier].master.url
      .replace(
        "https://swift.canadiana.ca/v1/AUTH_crkn/repository",
        cantaloupeUrl
      )
      .concat("/full/", { size }, "/", { format }, "?", token)
  );
  return url;
}

export { testManifestData as default };
