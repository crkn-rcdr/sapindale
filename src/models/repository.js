import {
  repositoryfilesize,
  repositoryverified,
  repositoryreplicate,
} from "../resources/couch";
let repostats = undefined,
  verified,
  merged = {},
  replicate = undefined;
/* const repositorydatabase = "tdrepo";

async function repositoryfilesize(token, options) {
  let result = await couchRequest(
    token,
    [repositorydatabase, "_design/tdr/_view/repofilesize"].join("/"),
    options
  );
  return result.rows;
}

async function repositoryverified(token, options) {
  let result = await couchRequest(
    token,
    [repositorydatabase, "_design/tdr/_view/repoverified"].join("/"),
    options
  );
  return result.rows;
}

async function repositoryreplicate(token, options) {
  let result = await couchRequest(
    token,
    [repositorydatabase, "_design/tdr/_view/replicate"].join("/"),
    options
  );
  return result.rows;
}

export { repositoryfilesize, repositoryverified, repositoryreplicate };
 */
async function refreshValues() {
  var reposize = undefined;
  try {
    var reposize = await repositoryfilesize({
      group_level: 1,
    });
  } catch (ignore) {}

  if (Array.isArray(reposize)) {
    var sizetemp = {};
    reposize.forEach(function (arepo) {
      sizetemp[arepo.key[0]] = arepo.value;
    });
    repostats = sizetemp;

    Object.keys(repostats).forEach(function (repository = "") {
      verified[repository] = {};
      repositoryverified({
        limit: 1,
        reduce: false,
        startkey: JSON.stringify([repository]),
        endkey: JSON.stringify([repository, {}]),
      }).then(function (rows) {
        if (Array.isArray(rows) && rows.length === 1) {
          verified[repository].earliest = new Date(rows[0].key[1]);
          calculate_human();
        }
      });

      repositoryverified({
        limit: 1,
        reduce: false,
        descending: true,
        endkey: JSON.stringify([repository]),
        startkey: JSON.stringify([repository, {}]),
      }).then(function (rows) {
        if (Array.isArray(rows) && rows.length === 1) {
          verified[repository].latest = new Date(rows[0].key[1]);
          calculate_human();
        }
      });
    });

    repositoryreplicate({
      group_level: 1,
    }).then(function (rows) {
      if (Array.isArray(rows) && rows.length > 0) {
        var temp = {};
        rows.forEach(function (row = {}) {
          temp[row.key[0]] = row.value;
        });
        replicate = temp;
      }
    });

    merged = {
      ...repostats,
      ...verified[repository],
    };
    console.log("Merged", merged);
    return {
      status: 200,
      content: { merged },
    };
  }
}

function calculate_human() {
  Object.keys(repostats).forEach(function (repository = "") {
    if (
      "earliest" in verified[repository] &&
      "latest" in verified[repository] &&
      !("human" in verified[repository])
    ) {
      var d1 = verified[repository].latest - verified[repository].earliest;

      var diffDays = parseInt(d1 / (1000 * 60 * 60 * 24));
      var months = Math.floor(diffDays / 30);
      var days = diffDays - months * 30;

      var mydate = new Date(d1);
      verified[repository].human =
        months +
        " months, " +
        days +
        " days, " +
        mydate.getUTCHours() +
        " hours, " +
        mydate.getUTCMinutes() +
        " minutes and " +
        mydate.getUTCSeconds() +
        " second(s)";
    }
  });
}
export default { refreshValues, calculate_human };
