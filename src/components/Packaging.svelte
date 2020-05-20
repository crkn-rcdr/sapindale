<script>
  import {
    packagingfilesystem,
    packagingstatus,
    packagingrequests,
    packagingconfigs,
    packagingdocs
  } from "../couch.js";
  import { state as authState } from "../auth.js";

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
    ingestchecks = {},
    aiplist = undefined,
    aiplistview = undefined,
    configs = undefined,
    packageconfig = "",
    showconfig = false,
    findidentifiers = "",
    AIPdata = {},
    findnotvalidText = undefined,
    findnotfoundText = undefined;

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
        configs = undefined;
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
        configs = undefined;
        break;

      case "find":
        var configtemp;
        try {
          configtemp = await packagingconfigs(token, {
            reduce: false,
            include_docs: true
          });
          if (!Array.isArray(configtemp)) {
            // TODO: Do something better for this error condition
            return;
          }
          configs = {};
          configtemp.forEach(function(aconfig) {
            configs[aconfig.id] = aconfig.doc;
          });
        } catch (ignore) {
          return;
        }
        filesystem = undefined;
        packagestatus = undefined;
        break;
      default:
        filesystem = undefined;
        packagestatus = undefined;
        configs = undefined;
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
    AIPdata = {};
    findnotvalidText = undefined;
    findnotfoundText = undefined;

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
          if (!(aipid in AIPdata)) {
            AIPdata[aipid] = {};
          }
          AIPdata[aipid]["identifier"] = currentID;
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
      findnotfoundText = laterelize(tempnotfound);
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
    document.getElementById("buttondiv-" + identifier).style.display = "none"; // Should I create new hash and use {if} ?
    var req = {
      nocreate: true,
      processreq: JSON.stringify({ request: "move", stage: move[identifier] })
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
  fieldset {
    border: 2px solid black;
    padding: 5px;
  }
  textarea {
    width: 100%;
    height: 100px;
  }
</style>

<!--
   Once the  filesystem view is loaded, display the table showing the different configid/stage/counts with buttons for the operator to pick one
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
                    viewFind();
                  }}>
                  {confstage.value}
                </button>
              </td>
            </tr>
          {/each}
        </table>
      {/if}
    {:else if whichgroup == 'status'}
      <div style="display:inline;">
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
      </div>
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
        Select packaging configuration:
        <select bind:value={packageconfig}>
          <option value="" />
          {#each Object.entries(configs) as [configid, config]}
            <option value={configid}>{config.title}</option>
          {/each}
        </select>

        {#if packageconfig !== ''}
          <label for="showconfig">
            <input type="checkbox" id="showconfig" bind:checked={showconfig} />
            Show config?
          </label>
          {#if showconfig}
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
                                {#if metsproc.extraparam}
                                  {metsproc.extraparam}
                                {/if}
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
          {:else}
            <br />
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
            configuration. An LAC reel was used only as an example.
            <textarea id="identifiers" bind:value={findidentifiers} />

            <div style="display:block;">
              <button
                type="submit"
                on:click={() => {
                  viewFind();
                }}>
                Find
              </button>
            </div>

            {#if findnotvalidText}
              <label for="findnotvalidtext">IDs not valid</label>
              <textarea
                id="findnotvalidtext"
                disabled="true"
                bind:value={findnotvalidText} />
            {/if}
            {#if findnotfoundText}
              <label for="findnotfoundtext">IDs not found</label>
              <textarea
                id="findnotfoundtext"
                disabled="true"
                bind:value={findnotfoundText} />
            {/if}
          {/if}
        {/if}
      {:else}Loading packaging configurations{/if}
    {/if}
  {/if}
</fieldset>

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
        Create/Manipulate AIPs in list (
        <label for="hidemanipulate">
          <input
            type="checkbox"
            id="hidemanipulate"
            bind:checked={hidemanipulate} />
          Hide?
        </label>
        )
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
              <div style="color:red; display:inline;">
                (Must be at least 5 characters)
              </div>
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
              <div style="color:red; display:inline;">Please Wait</div>
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
              <div style="color:red; display:inline;">
                (At least one stage must be chosen)
              </div>
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
            <div style="color:red; display:inline;">
              (Must be at least 5 characters)
            </div>
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
              <div style="color:red; display:inline;">Please Wait</div>
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
              <div style="color:red; display:inline;">
                (At least one stage must be chosen)
              </div>
            {/if}
          {/if}
        {/if}
      {/if}
    </fieldset>
  {/if}

  <!-- 
  A document list with checkboxes to have item added to ingest list.
-->
  <fieldset>
    <legend>
      Details about group of AIPs (
      <label for="hidepackagedetails">
        <input
          type="checkbox"
          id="hidepackagedetails"
          bind:checked={hidepackagedetails} />
        Hide?
      </label>
      )
    </legend>
    {#if !hidepackagedetails}
      <dl>
        {#each packagedocs as doc}
          <dt>
            <label>
              {#if doc._id in ingestchecks}
                <input
                  type="checkbox"
                  bind:checked={ingestchecks[doc._id]}
                  on:change={updateaiplist} />
              {/if}
              {doc._id}
            </label>
          </dt>
          <dd>
            {#if 'filesystem' in doc && 'stage' in doc.filesystem}
              <li>
                wip/{doc.filesystem.stage}/{doc.filesystem.configid}/{doc.filesystem.identifier}
                <div style="display:inline;" id="buttondiv-{doc._id}">
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
                </div>
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
            {/if}
            {#if 'processHistory' in doc && Array.isArray(doc.processHistory) && doc.processHistory.length > 0 && 'message' in doc.processHistory[0] && doc.processHistory[0].message !== ''}
              <pre>{doc.processHistory[0].message}</pre>
            {/if}
          </dd>
        {/each}
      </dl>
    {/if}
  </fieldset>
{/if}
