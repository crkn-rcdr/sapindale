import {
  repositoryfilesize,
  repositoryverified,
  repositoryreplicate,
} from "../resources/couch";
let repostats = undefined,
  verified,
  replicate = undefined;

async function repoLoad(merged) {
  var reposize = undefined;
  try {
    var reposize = await repositoryfilesize({
      group_level: 1,
    });
  } catch (ignore) {}

  if (Array.isArray(reposize)) {
    var sizetemp = {};
    reposize.map(async function (arepo) {
      sizetemp[arepo.key[0]] = arepo.value;
    });
    repostats = sizetemp;
    let repovar = Object.keys(repostats);
    repovar.map(async function (repository = "") {
      verified[repository] = {};
      rows = await repositoryverified({
        limit: 1,
        reduce: false,
        startkey: JSON.stringify([repository]),
        endkey: JSON.stringify([repository, {}]),
      }).then(async function (rows) {
        if (Array.isArray(rows) && rows.length === 1) {
          verified[repository].earliest = new Date(rows[0].key[1]);
          calculate_human();
        }
        return verified[repository].earliest;
      });

      await repositoryverified({
        limit: 1,
        reduce: false,
        descending: true,
        endkey: JSON.stringify([repository]),
        startkey: JSON.stringify([repository, {}]),
      }).then(async function (rows) {
        if (Array.isArray(rows) && rows.length === 1) {
          verified[repository].latest = new Date(rows[0].key[1]);
          calculate_human();
        }
        return verified[repository].latest;
      });

      await repositoryreplicate({
        group_level: 1,
      }).then(async function (rows) {
        if (Array.isArray(rows) && rows.length > 0) {
          var temp = {};
          rows.forEach(function (row = {}) {
            temp[row.key[0]] = row.value;
          });
          replicate = temp;
        }
        return replicate;
      });
    });
    /* Promise.all(repovar).then(function (response) {
      console.log("Inside Promise", response);
    }); */
    merged = {
      ...repostats,
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
export default { repoLoad, calculate_human };