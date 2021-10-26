import timespan from "pretty-ms";
import { getView } from "../resources/couch";

const db = "tdrepo";
const ddoc = "tdr";

const getVerified = async (repo, latest = false) => {
  let verifiedDate;
  const firstkey = [repo];
  const lastkey = [repo, {}];
  const response = await getView(db, ddoc, "repoverified", {
    limit: 1,
    reduce: false,
    descending: latest,
    startkey: JSON.stringify(latest ? lastkey : firstkey),
    endkey: JSON.stringify(latest ? firstkey : lastkey),
  });
  if (response.status === 200) {
    verifiedDate = new Date(response.content.rows[0].key[1]);
  }

  return verifiedDate;
};
const replicate = {};
const getReplicate = async () => {

  const response = await getView(db, ddoc, "replicate", {
    reduce: true,
    group_level: 1,
  });
  if (response.status === 200) {
    for (const repo in replicate) delete replicate[repo]; // Clear old values first
    for (const row of response.content.rows) {
      replicate[row.key] = row.value;
    }
  }
  return replicate;
};

const load = async () => {
  const response = await getView(db, ddoc, "repofilesize", {
    group_level: 1,
  });
  if (response.status === 200) {
    const replicate = await getReplicate();
    const stats = await Promise.all(
      response.content.rows.map(async (row) => {
        const repo = row.key[0];
        const earliest = await getVerified(repo, false);
        const latest = await getVerified(repo, true);
        const difference = timespan(latest - earliest, { compact: false });

        return {
          repo,
          aipCount: row.value.count,
          diskUsed: row.value.sum,
          earliest,
          latest,
          difference,
          replicate: replicate[repo] || 0,
        };
      })
    );

    return stats;
  } else {
    return {
      status: response.status,
      content: null,
      error: `repofilesize lookup failed: ${response.message}`,
    };
  }
};

export default { load };
