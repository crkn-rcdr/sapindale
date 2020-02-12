import qs from "query-string";
import testdata from "./couch/testManifest.json";
const cantaloupeUrl = process.env.CANTALOUPE;
function testManifestData(
  token,
  itentifier,
  region,
  size,
  rotation,
  quality,
  format
) {
  var Jdata = testdata;

  var Obj = JSON.parse(JSON.stringify(Jdata));
  let url = encodeURIComponent(
    [cantaloupeUrl].join("/") + Obj.m0bc1df2gh3jk.slug + "/data/sip/data/files/"
  );
  console.log("URL : ", url);
}

export { testManifestData };
