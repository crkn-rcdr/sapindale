import { _request as couchRequest } from "../couch.js";

const repositorydatabase = "tdrepo";

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
