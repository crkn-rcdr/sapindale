import timespan from "pretty-ms";
import { getView } from "../resources/couch";

const db = "tdrepo";
const ddoc = "tdr";

const getVerified = async (repo, latest = false) => {
  // TODO: implement this
  let verifiedDate, displayDate;
  if (!latest) {
    var start_key = [repo];
    var end_key = [repo, {}];
  } else {
    latest = true;
    start_key = [repo, {}];
    end_key = [repo];
  }
  const response = await getView(db, ddoc, "repoverified", {
    limit: 1,
    reduce: false,
    descending: latest,
    startkey: JSON.stringify(start_key),
    endkey: JSON.stringify(end_key),
  });
  if (response.status === 200) {
    response.content.rows.map(async (row) => {
      verifiedDate = new Date(row.key[1]);
    });
  }

  return verifiedDate;
};

const getReplicate = async (repo) => {
  const replicate = await getView(db, ddoc, "reporeplicate", {
    group_level: 1,
  });
  if (replicate.status === 200) {
    console.log("replicate:", replicate);
    replicate.content.rows.map(async (row) => {
      [row.key[0]] = row.value;
    });
  } else {
    replicate.message = "No replication";
  }
  return replicate;
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
        const difference = timespan(latest - earliest, { compact: false });
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
  } else {
    return {
      status: response.status,
      content: null,
      error: `repofilesize lookup failed: ${response.message}`,
    };
  }
};

export default { load };
