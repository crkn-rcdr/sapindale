import timespan from "pretty-ms";
import { getView } from "../resources/couch";

const db = "tdrepo";
const ddoc = "tdr";

const getVerified = async (repo, latest = false) => {
  // TODO: implement this
  return new Date();
};

const getReplicate = async (repo) => {
  // TODO: implement this
  return 0;
};

const load = async () => {
  const response = await getView(db, ddoc, "repofilesize", {
    group_level: 1,
  });

  if (response.status === 200) {
    const stats = await Promise.all(
      response.content.rows.map(async (row) => {
        const repo = row.key[0];
        const earliest = await getVerified(repo, false);
        const latest = await getVerified(repo, true);
        const difference = timespan(latest - earliest, { compact: true });
        const replicate = await getReplicate(repo);

        return {
          repo,
          aipCount: row.value.count,
          diskUsed: row.value.sum,
          earliest,
          latest,
          difference,
          replicate,
        };
      })
    );

    return stats;

    // let repovar = Object.keys(repostats);
    // repovar.map(async function (repository = "") {
    //   verified[repository] = {};
    //   rows = await getView(db, ddoc, "repoverified", {
    //     limit: 1,
    //     reduce: false,
    //     startkey: JSON.stringify([repository]),
    //     endkey: JSON.stringify([repository, {}]),
    //   }).then(async function (rows) {
    //     if (Array.isArray(rows) && rows.length === 1) {
    //       verified[repository].earliest = new Date(rows[0].key[1]);
    //       calculate_human();
    //     }
    //     return verified[repository].earliest;
    //   });

    //   await repositoryverified({
    //     limit: 1,
    //     reduce: false,
    //     descending: true,
    //     endkey: JSON.stringify([repository]),
    //     startkey: JSON.stringify([repository, {}]),
    //   }).then(async function (rows) {
    //     if (Array.isArray(rows) && rows.length === 1) {
    //       verified[repository].latest = new Date(rows[0].key[1]);
    //       calculate_human();
    //     }
    //     return verified[repository].latest;
    //   });

    //   await repositoryreplicate({
    //     group_level: 1,
    //   }).then(async function (rows) {
    //     if (Array.isArray(rows) && rows.length > 0) {
    //       var temp = {};
    //       rows.forEach(function (row = {}) {
    //         temp[row.key[0]] = row.value;
    //       });
    //       replicate = temp;
    //     }
    //     return replicate;
    //   });
    // });
    // /* Promise.all(repovar).then(function (response) {
    //   console.log("Inside Promise", response);
    // }); */
    // merged = {
    //   ...repostats,
    // };
    // console.log("Merged", merged);
    // return {
    //   status: 200,
    //   content: { merged },
    // };
  } else {
    return {
      status: response.status,
      content: null,
      error: `repofilesize lookup failed: ${response.message}`,
    };
  }
};

export default { load };
