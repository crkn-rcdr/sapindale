<script>
  import { onMount } from "svelte";
  import { packagingfilesystem, packagingrequests } from "../couch.js";
  import { state as authState } from "../auth.js";

  export let filesystem = undefined,
    hidefilesystem = false,
    idlist = undefined,
    packagedocs = undefined,
    hidepackagedetails = false,
    hidemanipulate = false,
    what = "d",
    move = {},
    ingestchecks = {},
    aiplist = undefined,
    aiplistview = undefined;

  // sIP / metadata forms
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

  onMount(async () => {
    try {
      filesystem = await packagingfilesystem(token, { group_level: 2 });
    } catch (ignore) {
      filesystem = undefined;
      return;
    }
  });

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

  async function viewConfstage(key = []) {
    resetVariables();
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
        ingestchecks = {};
        confstages.forEach(function(confstage) {
          if ("doc" in confstage) {
            var doc = confstage.doc;
            tempdocs.push(doc);
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
          }
        });
        updateaiplist();
        packagedocs = tempdocs;
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

  async function moveIdentifier(identifier) {
    document.getElementById("buttondiv-" + identifier).style.display = "none"; // Should I create new hash and use {if} ?
    var req = [
      {
        nocreate: true,
        processreq: JSON.stringify({ request: "move", stage: move[identifier] })
      }
    ];
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
    console.log(aiplist, req);

    var req = [
      {
        nocreate: true,
        processreq: JSON.stringify(requests)
      }
    ];
    await packagingrequests(token, aiplist, req);

    processindication = {
      start: false,
      reqs: requests.length,
      aips: aiplist.length
    };
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
{#if Array.isArray(filesystem)}
  <fieldset>
    <legend>
      Choose which group of AIPs (
      <label for="hidefilesystem">
        <input
          type="checkbox"
          id="hidefilesystem"
          bind:checked={hidefilesystem} />
        Hide?
      </label>
      )
    </legend>
    {#if !hidefilesystem}
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
      <select bind:value={what}>
        <option value="d">display directory details</option>
        <option value="l">display list</option>
      </select>
    {/if}
  </fieldset>
{:else}Loading Packaging filesystem information{/if}

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
              bind:value={changelog}
              value="" />
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
          <input
            type="text"
            size="50"
            id="changelog"
            bind:value={changelog}
            value="" />
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
