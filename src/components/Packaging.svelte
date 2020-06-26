<script>
  import {
    packagingfilesystem,
    packagingstatus,
    packagingrequests,
    packagingconfigs,
    packagingdocs
  } from "../couch/packaging.js";
  import { onMount } from "svelte";
  import { state as authState } from "../auth.js";

  var filesize = require("filesize");

  export let filesystem = undefined,
    packagestatus = undefined,
    statuslevel = "3",
    statustype = "f",
    hidegroup = false,
    idlist = undefined,
    packagedocs = undefined,
    hidepackagedetails = false,
    hidemanipulate = false,
    what = "d",
    whichgroup = "",
    move = {},
    create = {},
    exporttype = {},
    ingestchecks = {},
    aiplist = undefined,
    aiplistview = undefined,
    configs = undefined,
    packageconfig = "",
    hideconfig = true,
    findidentifiers = "",
    AIPidentifier = {},
    findnotvalidText = undefined,
    findnotfound = undefined,
    hidenotfound = false,
    showmessage = true,
    wipwalk = undefined,
    hidewipwalk = false;

  // SIP / metadata forms
  export let ingestType = "new",
    changelog = "",
    processstages = {
      pre: true,
      imageconv: false,
      sip: true,
      manipmd: true,
      i: true,
      cs: true,
      post: true
    },
    ilabel = true,
    idmd = true,
    clabel = false,
    processindication = undefined;

  let token = $authState.token;

  // This was previously in config.json -- what are out plans for this type of thing with svelte?
  const stages = [
    "Assembly",
    "Processing",
    "Trashcan",
    "Rejected",
    "OCR",
    "Ready",
    "Proofed"
  ];

  onMount(() => {
    loadpackageconfigs();
    loadwipwalk();

    // Load again every 2 minutes
    const interval = setInterval(loadwipwalk, 120000);

    // If a function is returned from onMount, it will be called when the component is unmounted.
    // https://svelte.dev/repl/2e976c8411ad4bbbace89dee9b51c987
    return () => clearInterval(interval);
  });

  async function loadpackageconfigs() {
    try {
      var configtemp = await packagingconfigs(token, {
        reduce: false,
        include_docs: true
      });
      if (Array.isArray(configtemp)) {
        configs = {};
        configtemp.forEach(function(aconfig) {
          configs[aconfig.id] = aconfig.doc;
        });
      }
    } catch (ignore) {}
  }

  function resetVariables() {
    idlist = undefined;
    packagedocs = undefined;
    aiplist = undefined;
    aiplistview = undefined;
    ingestType = "new";
    changelog = "";
    processstages = {
      pre: true,
      imageconv: false,
      sip: true,
      manipmd: true,
      i: true,
      cs: true,
      post: true
    };
    ilabel = true;
    idmd = true;
    clabel = false;
    processindication = undefined;
  }

  async function loadwipwalk() {
    var mywipwalk;
    try {
      var mywipwalk = await packagingdocs(token, ["wipwalk.wipwalk"], {
        include_docs: true
      });
    } catch (ignore) {}
    if (!Array.isArray(mywipwalk) || mywipwalk.length !== 1) {
      // TODO: Do something better for this error condition
      return;
    }
    // Use parsed date so local timezone of browser displayed
    mywipwalk[0].doc.Date = new Date(mywipwalk[0].doc.updated);
    wipwalk = mywipwalk[0].doc;
  }

  async function loadgroup() {
    idlist = undefined; // Reset when we switch group
    packagedocs = undefined; // Reset when we switch group
    switch (whichgroup) {
      case "fs":
        try {
          filesystem = await packagingfilesystem(token, { group_level: 2 });
        } catch (ignore) {
          filesystem = undefined;
          return;
        }
        packagestatus = undefined;
        break;
      case "status":
        var start = undefined;
        var end = undefined;
        if (statustype !== "b") {
          var truthiness = statustype === "s";
          start = JSON.stringify([truthiness]);
          end = JSON.stringify([truthiness, {}]);
        }
        try {
          packagestatus = await packagingstatus(token, {
            group_level: parseInt(statuslevel),
            startkey: start,
            endkey: end
          });
        } catch (ignore) {
          packagestatus = undefined;
          return;
        }
        filesystem = undefined;
        break;

      case "find":
        filesystem = undefined;
        packagestatus = undefined;
        break;
      default:
        filesystem = undefined;
        packagestatus = undefined;
    }
  }

  async function viewStatus(key = []) {
    resetVariables();
    hidemanipulate = true; // Most likely we don't want to manipulate from a status lookup
    try {
      // I haven't yet found a better way to copy the array...
      var endkey = JSON.parse(JSON.stringify(key));
      endkey.push({});
      var statusdocs = await packagingstatus(token, {
        reduce: false,
        startkey: JSON.stringify(key),
        endkey: JSON.stringify(endkey),
        include_docs: what === "d"
      });
      if (!Array.isArray(statusdocs)) {
        // TODO: Do something better for this error condition
        return;
      }
      if (what === "d") {
        var tempdocs = [];
        statusdocs.forEach(function(statusdoc) {
          if ("doc" in statusdoc) {
            tempdocs.push(statusdoc.doc);
          }
        });
        packagedocs = tempdocs;
        setIngestChecks();
        updateaiplist();
      } else {
        var templist = [];
        statusdocs.forEach(function(statusdoc) {
          templist.push(statusdoc.id);
        });
        idlist = templist;
      }
    } catch (ignore) {
      // TODO: Do something better for this error condition
      return;
    }
  }

  async function viewConfstage(key = []) {
    resetVariables();
    hidemanipulate = false; // Most likely we want to manipulate from a status lookup
    try {
      // I haven't yet found a better way to copy the array...
      var endkey = JSON.parse(JSON.stringify(key));
      endkey.push({});
      var confstages = await packagingfilesystem(token, {
        reduce: false,
        startkey: JSON.stringify(key),
        endkey: JSON.stringify(endkey),
        include_docs: what === "d"
      });
      if (!Array.isArray(confstages)) {
        // TODO: Do something better for this error condition
        return;
      }
      if (what === "d") {
        var tempdocs = [];
        confstages.forEach(function(confstage) {
          if ("doc" in confstage) {
            tempdocs.push(confstage.doc);
          }
        });
        packagedocs = tempdocs;
        setIngestChecks();
        updateaiplist();
      } else {
        var templist = [];
        confstages.forEach(function(confstage) {
          templist.push(confstage.id);
        });
        idlist = templist;
      }
    } catch (ignore) {
      // TODO: Do something better for this error condition
      return;
    }
  }

  function setIngestChecks() {
    ingestchecks = {};
    packagedocs.forEach(function(doc) {
      // Set the checkbox to true, but only if certain conditions met.
      if (
        "label" in doc &&
        "_attachments" in doc &&
        "filesystem" in doc &&
        "stage" in doc.filesystem &&
        doc.filesystem.state !== "Trashcan"
      ) {
        ingestchecks[doc._id] = true;
      }
    });
  }

  async function createEmpty(aip = "") {
    await packagingrequests(token, [aip], {});
    viewFind();
  }

  async function viewFind() {
    resetVariables();
    findidentifiers.replace(/["]/g, "");
    var IDs = findidentifiers.split(/[,|\s]/);
    var AIPlist = [];
    var depositor = configs[packageconfig].depositor;
    var valid_TDR_identifier_exp = /^[A-Za-z0-9_-]{5,64}$/;
    var tempnotvalid = [];

    // Initialise globals used for display
    packagedocs = undefined;
    idlist = undefined;
    AIPidentifier = {};
    findnotvalidText = undefined;
    findnotfound = undefined;

    for (var index in IDs) {
      var currentID = IDs[index];
      if (/\S/.test(currentID)) {
        if (currentID.substr(0, depositor.length + 1) === depositor + ".") {
          currentID = currentID.substr(depositor.length + 1);
        }
        var objid = i2objid(currentID);

        if (valid_TDR_identifier_exp.test(objid)) {
          var aipid = depositor + "." + objid;
          AIPlist.push(aipid);
          if (!(aipid in AIPidentifier) && currentID !== objid) {
            AIPidentifier[aipid] = currentID;
          }
        } else tempnotvalid.push(currentID);
      }
    }
    if (tempnotvalid.length > 0) {
      findnotvalidText = laterelize(tempnotvalid);
    }

    var mydocs = await packagingdocs(token, AIPlist, {
      include_docs: what === "d"
    });
    if (!Array.isArray(mydocs)) {
      // TODO: Do something better for this error condition
      return;
    }
    var tempdocs = [];
    var tempids = [];
    var tempnotfound = [];
    mydocs.forEach(function(doc) {
      if ("doc" in doc) {
        tempdocs.push(doc.doc);
      } else if ("id" in doc) {
        tempids.push(doc.id);
      } else {
        tempnotfound.push(doc.key);
      }
    });
    if (tempnotfound.length > 0) {
      findnotfound = tempnotfound;
    }
    if (tempids.length > 0) {
      idlist = tempids;
    } else {
      packagedocs = tempdocs;
      setIngestChecks();
      updateaiplist();
    }
  }

  function i2objid(identifier = "") {
    if (
      "i2objid" in configs[packageconfig] &&
      Array.isArray(configs[packageconfig].i2objid)
    ) {
      configs[packageconfig].i2objid.forEach(function(value = {}) {
        identifier = identifier.replace(
          new RegExp(value.search, "g"),
          value.replace
        );
      });
    }
    return identifier;
  }

  async function moveIdentifier(identifier) {
    document.getElementById("buttonmove-" + identifier).style.display = "none"; // Should I create new hash and use {if} ?
    var req = {
      nocreate: true,
      processreq: JSON.stringify({ request: "move", stage: move[identifier] })
    };
    await packagingrequests(token, [identifier], req);
  }

  async function createIdentifier(identifier) {
    document.getElementById("buttoncreate-" + identifier).style.display =
      "none"; // Should I create new hash and use {if} ?
    var req = {
      nocreate: true,
      processreq: JSON.stringify({
        request: "move",
        stage: create[identifier],
        empty: true,
        configid: packageconfig,
        identifier:
          identifier in AIPidentifier ? AIPidentifier[identifier] : identifier
      })
    };
    await packagingrequests(token, [identifier], req);
  }

  async function exportIdentifier(identifier) {
    document.getElementById("export-" + identifier).style.display = "none"; // Should I create new hash and use {if} ?
    var req = {
      nocreate: true,
      processreq: JSON.stringify({
        request: "export",
        type: exporttype[identifier],
        wipDir: "Temp/export/" + packageconfig,
        createdest: true
      })
    };
    await packagingrequests(token, [identifier], req);
  }

  async function silenceIdentifier(identifier) {
    document.getElementById("silence-" + identifier).style.display = "none"; // Should I create new hash and use {if} ?
    var req = {
      nocreate: true,
      silence: true
    };
    await packagingrequests(token, [identifier], req);
  }

  async function retryIdentifier(identifier, oldreq) {
    document.getElementById("retry-" + identifier).style.display = "none"; // Should I create new hash and use {if} ?
    if (Array.isArray(oldreq)) {
      var processreq = [{ request: "move", stage: "Processing" }];
      oldreq.forEach(function(thisReq) {
        delete thisReq["processhost"];
        delete thisReq["processdate"];
        processreq.push(thisReq);
      });
    }
    var req = {
      nocreate: true,
      processreq: JSON.stringify(processreq)
    };
    await packagingrequests(token, [identifier], req);
  }

  async function updateaiplist() {
    var tempaiplist = [];
    Object.keys(ingestchecks).forEach(function(checkaip) {
      if (ingestchecks[checkaip]) {
        tempaiplist.push(checkaip);
      }
    });
    if (tempaiplist.length > 0) {
      aiplistview = tempaiplist.join(" ");
    } else {
      aiplistview = undefined;
    }
    aiplist = tempaiplist;
  }

  async function startprocess() {
    var requests = [];

    if (processstages.pre) {
      requests.push({ request: "move", stage: "Processing" });
    }
    if (ingestType !== "metadata") {
      if (processstages.imageconv) {
        requests.push({ request: "imageconv", fileconfig: true });
      }
      if (processstages.sip) {
        requests.push({ request: "buildsip" });
      }
    } else {
      if (processstages.manipmd) {
        requests.push({
          request: "manipmd",
          label: ilabel,
          clabel: clabel,
          dmdsec: idmd
        });
      }
    }
    if (processstages.i) {
      requests.push({
        request: "ingest",
        type: ingestType,
        changelog: changelog
      });
    }
    if (processstages.cs) {
      requests.push({ request: "copyingest2swift" });
    }
    if (processstages.post) {
      requests.push({ request: "move", stage: "Trashcan" });
    }

    processindication = {
      start: true,
      reqs: requests.length,
      aips: aiplist.length
    };

    var req = {
      nocreate: true,
      processreq: JSON.stringify(requests)
    };
    await packagingrequests(token, aiplist, req);

    // changing start to false alone isn't reacted to
    processindication = {
      start: false,
      reqs: requests.length,
      aips: aiplist.length
    };
  }

  function laterelize(words = []) {
    var output = "";
    for (var word in words) output += words[word] + "\n";
    return output;
  }
</script>

<style>
  ul {
    list-style-type: disc;
    list-style-position: inside;
  }
  dd,
  dl,
  dt {
    display: block;
    unicode-bidi: embed;
  }
  dd {
    margin-left: 5%;
  }
</style>

<h1>CRKN/Canadiana/CIHM packaging</h1>

{#if wipwalk}
  <fieldset>
    <legend>
      (
      <label for="hidewipwalk">
        <input type="checkbox" id="hidewipwalk" bind:checked={hidewipwalk} />
        Hide?
      </label>
      ) Packaging Walk report
    </legend>
    {#if !hidewipwalk}
      Last update: {wipwalk.Date}
      <br />
      <table>
        <tr>
          <th colspan="2" align="center">Disk Usage</th>
        </tr>
        <tr>
          <th>Total</th>
          <td>{filesize(wipwalk.df.blocks)}</td>
        </tr>
        <tr>
          <th>Free</th>
          <td>{filesize(wipwalk.df.bfree)}</td>
        </tr>
        <tr>
          <th>Used</th>
          <td>{filesize(wipwalk.df.bused)} = {wipwalk.df.per}%</td>
        </tr>
      </table>

      {#if Array.isArray(wipwalk.warnings) && wipwalk.warnings.length > 0}
        <p>
          <b>Warnings!</b>
        </p>
        <ul>
          {#each wipwalk.warnings as warning}
            <li>{warning}</li>
          {/each}
        </ul>
      {/if}
    {/if}
  </fieldset>
{/if}
{#if configs}
  <fieldset>
    <legend>
      (
      <label for="hideconfig">
        <input type="checkbox" id="hideconfig" bind:checked={hideconfig} />
        Hide?
      </label>
      ) Select packaging configuration:
      <select bind:value={packageconfig}>
        <option value="" />
        {#each Object.entries(configs) as [configid, config]}
          <option value={configid}>{config.title}</option>
        {/each}
      </select>
    </legend>
    {#if packageconfig !== '' && !hideconfig}
      <table border="1" id="confTable">
        <tr>
          <th>Variable</th>
          <th>Value</th>
        </tr>
        <tr>
          <td>ConfigID</td>
          <td>{packageconfig}</td>
        </tr>
        {#each Object.entries(configs[packageconfig]) as [property, value]}
          {#if property.charAt() !== '_'}
            {#if property === 'metsproc'}
              <tr>
                <td>metsproc commands</td>
                <td>
                  <table>
                    <tr>
                      <th>regexp</th>
                      <th>command</th>
                    </tr>

                    {#each value as metsproc}
                      <tr>
                        <td>
                          {#if metsproc.regex}{metsproc.regex}{/if}
                        </td>
                        <td>
                          {metsproc.command}
                          {#if metsproc.extraparam}{metsproc.extraparam}{/if}
                        </td>
                      </tr>
                    {/each}

                  </table>
                </td>
              </tr>
            {:else if property === 'fileconfig'}
              <tr>
                <td>File Configuration</td>
                <td>
                  <table>
                    <tr>
                      <th>regexp</th>
                      <th>class</th>
                      <th>ignored</th>
                    </tr>

                    {#each value as fileconfig}
                      <tr>
                        <td>
                          {#if fileconfig.regex}{fileconfig.regex}{/if}
                        </td>
                        <td>
                          {#if fileconfig.class}{fileconfig.class}{/if}
                        </td>
                        <td>
                          {#if fileconfig.ignore}{fileconfig.ignore}{/if}
                        </td>
                      </tr>
                    {/each}

                  </table>
                </td>
              </tr>
            {:else if property === 'i2objid'}
              <tr>
                <td>Identifier to Object ID mappings</td>
                <td>
                  <table>
                    <tr>
                      <th>search</th>
                      <th>replace</th>
                    </tr>

                    {#each value as i2omap}
                      <tr>
                        <td>
                          {#if i2omap.search}{i2omap.search}{/if}
                        </td>
                        <td>
                          {#if i2omap.replace}{i2omap.replace}{/if}
                        </td>
                      </tr>
                    {/each}

                  </table>
                </td>
              </tr>
            {:else if typeof value === 'string' || typeof value === 'boolean'}
              <tr>
                <td>{property}</td>
                <td>{value}</td>
              </tr>
            {:else}
              <tr>
                <td>{property}</td>
                <td>{JSON.stringify(value)}</td>
              </tr>
            {/if}
          {/if}
        {/each}
      </table>
    {/if}
  </fieldset>
{/if}

<!--
   There are 3 different possible sets of fields for this fieldset
 -->
<fieldset>
  <legend>
    (
    <label for="hidegroup">
      <input type="checkbox" id="hidegroup" bind:checked={hidegroup} />
      Hide?
    </label>
    ) Choose which group of AIPs from
    <select bind:value={whichgroup} on:change={loadgroup}>
      <option value="">(please pick)</option>
      <option value="fs">filesystem</option>
      <option value="status">processing status</option>
      <option value="find">a list I supply</option>
    </select>
    and
    <select bind:value={what}>
      <option value="d">display details</option>
      <option value="l">display list</option>
    </select>
  </legend>
  {#if !hidegroup}
    {#if whichgroup === 'fs'}
      {#if Array.isArray(filesystem)}
        <table border="1" id="typeTable">
          <tr>
            <th>Config ID</th>
            <th>Stage</th>
            <th>Identifier count</th>
          </tr>
          {#each filesystem as confstage}
            <tr>
              <td>{confstage.key[0]}</td>
              <td>{confstage.key[1]}</td>
              <td>
                <button
                  on:click={() => {
                    viewConfstage(confstage.key);
                  }}>
                  {confstage.value}
                </button>
              </td>
            </tr>
          {/each}
        </table>
      {/if}
    {:else if whichgroup == 'status'}
      <p class="children-inline">
        Show
        <select id="statustype" bind:value={statustype} on:change={loadgroup}>
          <option value="s">success</option>
          <option value="f">failure</option>
          <option value="b">success and failure</option>
        </select>
        grouping by
        <select id="statuslevel" bind:value={statuslevel} on:change={loadgroup}>
          <option value="0">all</option>
          <option value="1">success/failure</option>
          <option value="2">if there a message?</option>
          <option value="3">date</option>
          <option value="4">date and time</option>
        </select>
      </p>
      {#if Array.isArray(packagestatus)}
        <table border="1" id="typeTable">
          <tr>
            <th>Status</th>
            {#if statuslevel > 1}
              <th>Message</th>
            {/if}
            {#if statuslevel > 2}
              <th>Date</th>
            {/if}
            {#if statuslevel > 3}
              <th>time</th>
            {/if}
            <th>Identifier Count</th>
          </tr>
          {#each packagestatus as status}
            <tr>
              <td>
                {#if status.key[0]}success{:else}fail{/if}
              </td>
              {#if statuslevel > 1}
                <td>
                  {#if status.key[1]}yes{:else}no{/if}
                </td>
              {/if}
              {#if statuslevel > 2}
                <td>{status.key[2]}</td>
              {/if}
              {#if statuslevel > 3}
                <td>{status.key[3]}</td>
              {/if}
              <td>
                <button
                  on:click={() => {
                    viewStatus(status.key);
                  }}>
                  {status.value}
                </button>
              </td>
            </tr>
          {/each}
        </table>
      {/if}
    {:else if whichgroup == 'find'}
      {#if configs}
        {#if packageconfig !== ''}
          <br />
          <p>Fill in identifiers in one of the following formats:</p>
          <ul>
            <li>
              <b>depositor.OBJID</b>
              (example: oocihm.lac_reel_c10679)
            </li>
            <li>
              <b>depositor.identifier</b>
              (example: oocihm.C-10680)
            </li>
            <li>
              <b>OBJID</b>
              (example: lac_reel_c10681)
            </li>
            <li>
              <b>identifier</b>
              (example: C-10682)
            </li>
          </ul>
          What is allowed as an identifier is specific to the chosen
          configuration. An LAC reel was used only as an example. With {configs[packageconfig].title}
          the depositor is "{configs[packageconfig].depositor}"
          <textarea id="identifiers" bind:value={findidentifiers} />

          <button
            type="submit"
            on:click={() => {
              viewFind();
            }}>
            Find
          </button>

          {#if findnotvalidText}
            <label for="findnotvalidtext">IDs not valid</label>
            <textarea
              id="findnotvalidtext"
              disabled="true"
              bind:value={findnotvalidText} />
          {/if}
        {:else}Please choose a packaging configuration.{/if}
      {/if}
    {/if}
  {/if}
</fieldset>

{#if Array.isArray(findnotfound)}
  <fieldset>
    <legend>
      (
      <label for="hidenotfound">
        <input type="checkbox" id="hidenotfound" bind:checked={hidenotfound} />
        Hide?
      </label>
      ) IDs not found
    </legend>
    {#if !hidenotfound}
      <ul>
        {#each findnotfound as notfoundid}
          <li>
            {notfoundid}
            <button
              type="submit"
              on:click={() => {
                createEmpty(notfoundid);
              }}>
              Create empty record
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </fieldset>
{/if}

<!--
  After the operator clicks a button for a configID/stage, the packaging database documents for that specific list of identifiers is selected.

  If a list was requested, an array of identifiers is returned.

-->
{#if idlist}
  <pre>
    {#each idlist as id}{id + '\n'}{/each}
  </pre>
{/if}
<!--

  If directory details were requested, an array of packaging database documents is returned

-->
{#if packagedocs}
  {#if aiplistview}
    <fieldset>
      <legend>
        (
        <label for="hidemanipulate">
          <input
            type="checkbox"
            id="hidemanipulate"
            bind:checked={hidemanipulate} />
          Hide?
        </label>
        ) Create/Manipulate AIPs in list
      </legend>
      {#if !hidemanipulate}
        <textarea id="aiplist" disabled="true" bind:value={aiplistview} />
        <select bind:value={ingestType}>
          <option value="new">Generate SIP (new AIP)</option>
          <option value="update">Generate SIP (update AIP)</option>
          <option value="metadata">Manipulate Metadata (update AIP)</option>
        </select>

        {#if ingestType !== 'metadata'}
          <p>
            SIP ingest type:
            <br />
            Changelog:
            <input
              type="text"
              size="50"
              id="changelog"
              bind:value={changelog} />
            {#if typeof changelog !== 'string' || changelog.length < 5}
              <span class="danger">(Must be at least 5 characters)</span>
            {/if}
            <br />
            Stages in process:
          </p>

          <ul>
            <li>
              <input type="checkbox" bind:checked={processstages.pre} />
              Move to Processing
            </li>
            <li>
              <input type="checkbox" bind:checked={processstages.imageconv} />
              Image Conversion
            </li>
            <li>
              <input type="checkbox" bind:checked={processstages.sip} />
              Build SIP
            </li>
            <li>
              <input type="checkbox" bind:checked={processstages.i} />
              Ingest
            </li>
            <li>
              <input type="checkbox" bind:checked={processstages.cs} />
              Copy to Swift
            </li>
            <li>
              <input type="checkbox" bind:checked={processstages.post} />
              Move to Trashcan
            </li>
          </ul>

          {#if processindication}
            {#if processindication.start}
              Submitting {processindication.reqs} requests for {processindication.aips}
              AIPs...
              <span class="danger">Please Wait</span>
            {:else}
              Submitted {processindication.reqs} requests for {processindication.aips}
              AIPs!
            {/if}
          {:else}
            <button
              type="submit"
              on:click={() => {
                startprocess();
              }}
              disabled={typeof changelog !== 'string' || changelog.length < 5 || !(processstages.pre || processstages.imageconv || processstages.sip || processstages.i || processstages.cs || processstages.post)}>
              Ingest SIP
            </button>
            {#if !(processstages.pre || processstages.imageconv || processstages.sip || processstages.i || processstages.cs || processstages.post)}
              <span class="danger">(At least one stage must be chosen)</span>
            {/if}
          {/if}
        {:else}
          Manipulate Metadata:
          <ul>
            <li>
              <input type="checkbox" bind:checked={ilabel} />
              Item Label
            </li>
            <li>
              <input type="checkbox" bind:checked={idmd} />
              Item Descriptive Metadata
            </li>
            <li>
              <input type="checkbox" bind:checked={clabel} />
              Component Label
            </li>
          </ul>
          Changelog:
          <input type="text" size="50" id="changelog" bind:value={changelog} />
          {#if typeof changelog !== 'string' || changelog.length < 5}
            <span class="danger">(Must be at least 5 characters)</span>
          {/if}
          <br />
          Stages in process:
          <ul>
            <li>
              <input type="checkbox" bind:checked={processstages.pre} />
              Move to Processing
            </li>
            <li>
              <input type="checkbox" bind:checked={processstages.manipmd} />
              Manipulate Metadata
            </li>
            <li>
              <input type="checkbox" bind:checked={processstages.i} />
              Ingest (update metadata)
            </li>
            <li>
              <input type="checkbox" bind:checked={processstages.cs} />
              Copy to Swift
            </li>
            <li>
              <input type="checkbox" bind:checked={processstages.post} />
              Move to Trashcan
            </li>
          </ul>
          <br />

          {#if processindication}
            {#if processindication.start}
              Submitting {processindication.reqs} requests for {processindication.aips}
              AIPs...
              <span class="danger">Please Wait</span>
            {:else}
              Submitted {processindication.reqs} requests for {processindication.aips}
              AIPs!
            {/if}
          {:else}
            <button
              type="submit"
              on:click={() => {
                startprocess();
              }}
              disabled={typeof changelog !== 'string' || changelog.length < 5 || !(processstages.pre || processstages.manipmd || processstages.i || processstages.cs || processstages.post)}>
              Manipulate Metadata
            </button>
            {#if !(processstages.pre || processstages.manipmd || processstages.i || processstages.cs || processstages.post)}
              <span class="danger">(At least one stage must be chosen)</span>
            {/if}
          {/if}
        {/if}
      {/if}
    </fieldset>
  {/if}

  <!-- 
  List showing details from a CouchDB packaging document, including checkboxes when ingest is possible.
-->
  <fieldset>
    <legend>
      (
      <label for="hidepackagedetails">
        <input
          type="checkbox"
          id="hidepackagedetails"
          bind:checked={hidepackagedetails} />
        Hide?
      </label>
      ) Details about group of AIPs
    </legend>
    {#if !hidepackagedetails}
      <!--
Some buttons to show/hide specific parts

 -->
      <table>
        <tr>
          <th>
            <input type="checkbox" bind:checked={showmessage} />
            Process Messages
          </th>
        </tr>
      </table>

      <dl>
        {#each packagedocs as doc}
          <dt>
            <span class="children-inline">
              <label>
                {#if doc._id in ingestchecks}
                  <input
                    type="checkbox"
                    bind:checked={ingestchecks[doc._id]}
                    on:change={updateaiplist} />
                {/if}
                {doc._id}
              </label>
              {#if AIPidentifier[doc._id]}({AIPidentifier[doc._id]}){/if}
            </span>
          </dt>
          <dd>

            {#if 'filesystem' in doc && 'stage' in doc.filesystem}
              <li>
                wip/{doc.filesystem.stage}/{doc.filesystem.configid}/{doc.filesystem.identifier}
                <span class="children-inline" id="buttonmove-{doc._id}">
                  (
                  <button
                    on:click={() => {
                      moveIdentifier(doc._id);
                    }}>
                    Move to
                  </button>
                  <select bind:value={move[doc._id]}>
                    {#each stages as stage}
                      <option value={stage}>{stage}</option>
                    {/each}
                  </select>
                  )
                </span>
              </li>
            {:else if packageconfig !== ''}
              <li>
                <span class="children-inline" id="buttoncreate-{doc._id}">
                  <button
                    on:click={() => {
                      createIdentifier(doc._id);
                    }}>
                    Create in
                  </button>
                  <select bind:value={create[doc._id]}>
                    {#each stages as stage}
                      <option value={stage}>{stage}</option>
                    {/each}
                  </select>
                </span>
              </li>
            {/if}

            {#if !('label' in doc)}
              <li>No item label found</li>
            {:else if !('_attachments' in doc) || !('dmd.xml' in doc._attachments)}
              <li>No dmd.xml found</li>
            {/if}

            {#if 'classify' in doc && Object.keys(doc.classify).length > 0}
              <li>
                Classification:
                {#each Object.keys(doc.classify) as thiskey, index}
                  {#if index > 0},{/if}
                  {thiskey}={doc.classify[thiskey]}
                {/each}
              </li>
            {/if}

            {#if 'repos' in doc && Array.isArray(doc.repos)}
              <li>
                Found in TDR date={doc.reposManifestDate} Repos=
                {#each doc.repos as thisrepo, index}
                  {#if index > 0},{/if}
                  {thisrepo}
                {/each}
              </li>

              {#if packageconfig !== ''}
                <li class="children-inline" id="export-{doc._id}">
                  <select bind:value={exporttype[doc._id]}>
                    <option value="aip">aip</option>
                    <option value="sip">sip</option>
                    <option value="METS">METS</option>
                    <option value="dmdSec">dmdSec</option>
                  </select>
                  <button
                    type="submit"
                    on:click={() => {
                      exportIdentifier(doc._id);
                    }}>
                    export to Temp/export/{packageconfig}
                  </button>
                </li>
              {/if}
            {/if}

            {#if 'processReq' in doc && Array.isArray(doc.processReq) && doc.processReq.length > 0}
              <li>
                Next processing request is {doc.processReq[0].request} of {doc.processReq.length}
                request(s)
              </li>
            {/if}

            {#if 'processHistory' in doc && Array.isArray(doc.processHistory) && doc.processHistory.length > 0}
              {#if !doc.processHistory[0].status}
                <li class="children-inline">
                  Last request failed: {doc.processHistory[0].request}
                  <button
                    id="silence-{doc._id}"
                    type="submit"
                    on:click={() => {
                      silenceIdentifier(doc._id);
                    }}>
                    Silence error
                  </button>
                  <button
                    id="retry-{doc._id}"
                    type="submit"
                    on:click={() => {
                      retryIdentifier(doc._id, doc.processHistory[0].req);
                    }}>
                    Retry {doc.processHistory[0].req.length} requests
                  </button>
                </li>
              {/if}

              {#if showmessage && 'message' in doc.processHistory[0] && doc.processHistory[0].message !== ''}
                <textarea disabled="true">
                  {doc.processHistory[0].message}
                </textarea>
              {/if}
            {/if}
          </dd>
        {/each}
      </dl>
    {/if}
  </fieldset>
{/if}
