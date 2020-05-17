<script>
  import { onMount } from "svelte";
  import { packagingfilesystem } from "../couch.js";
  import { state as authState } from "../auth.js";

  export let filesystem = undefined,
    hidefilesystem = false,
    idlist = undefined,
    packagedocs = undefined,
    hidepackagedetails = false,
    hidemanipulate = false,
    what = "d",
    isSIP = "true",
    move = {},
    ingestchecks = {},
    aiplist = undefined,
    aiplistview = undefined;

  // Ingest form
  export let ingestType = "new",
    changelog = "",
    ingeststages = {
      pre: true,
      imageconv: false,
      sip: true,
      i: true,
      cs: true,
      post: true
    };

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

  async function viewConfstage(key = []) {
    idlist = undefined;
    packagedocs = undefined;
    aiplist = undefined;
    aiplistview = undefined;
    ingestType = "new";
    changelog = "";
    ingeststages = {
      pre: true,
      imageconv: false,
      sip: true,
      i: true,
      cs: true,
      post: true
    };
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
    console.log("move", identifier, move[identifier]);
    document.getElementById("buttondiv-" + identifier).style.display = "none"; // Should I create new hash and use {if} ?
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

  async function ingestprocess() {
    console.log("ingestprocess", ingestType, changelog, ingeststages);
  }

  async function manipmdprocess() {}
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
    <legend>Choose which group of AIPs</legend>
    <label for="hidefilesystem">
      <input
        type="checkbox"
        id="hidefilesystem"
        bind:checked={hidefilesystem} />
      Hide?
    </label>
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
      <legend>Create/Manipulate AIPs in list</legend>
      <label for="hidemanipulate">
        <input
          type="checkbox"
          id="hidemanipulate"
          bind:checked={hidemanipulate} />
        Hide?
      </label>
      {#if !hidemanipulate}
        <textarea id="aiplist" disabled="true" bind:value={aiplistview} />
      {/if}
      <select bind:value={isSIP}>
        <option value="true">Create SIP (new/update)</option>
        <option value="false">Manipulate Metadata</option>
      </select>
      {#if isSIP === 'true'}
        <p>
          SIP ingest type:
          <select bind:value={ingestType}>
            <option value="new">New SIP</option>
            <option value="update">Update SIP</option>
          </select>
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
            <input type="checkbox" bind:checked={ingeststages.pre} />
            Move to Processing
          </li>
          <li>
            <input type="checkbox" bind:checked={ingeststages.imageconv} />
            Image Conversion
          </li>
          <li>
            <input type="checkbox" bind:checked={ingeststages.sip} />
            Build SIP
          </li>
          <li>
            <input type="checkbox" bind:checked={ingeststages.i} />
            Ingest
          </li>
          <li>
            <input type="checkbox" bind:checked={ingeststages.cs} />
            Copy to Swift
          </li>
          <li>
            <input type="checkbox" bind:checked={ingeststages.post} />
            Move to Trashcan
          </li>
        </ul>

        <button
          type="submit"
          on:click={() => {
            ingestprocess();
          }}
          disabled={typeof changelog !== 'string' || changelog.length < 5 || !(ingeststages.pre || ingeststages.imageconv || ingeststages.sip || ingeststages.i || ingeststages.cs || ingeststages.post)}>
          Ingest
        </button>
        {#if !(ingeststages.pre || ingeststages.imageconv || ingeststages.sip || ingeststages.i || ingeststages.cs || ingeststages.post)}
          <div style="color:red; display:inline;">
            (At least one stage must be chosen)
          </div>
        {/if}
      {:else}Metadata{/if}

    </fieldset>
  {/if}

  <!-- 
  A document list with checkboxes to have item added to ingest list.
-->
  <fieldset>
    <legend>Details about group of AIPs</legend>
    <label for="hidepackagedetails">
      <input
        type="checkbox"
        id="hidepackagedetails"
        bind:checked={hidepackagedetails} />
      Hide?
    </label>
    {#if !hidepackagedetails}
      <dl>
        {#each packagedocs as doc}
          <dt>
            {doc._id}
            {#if 'filesystem' in doc && 'stage' in doc.filesystem}
              wip/{doc.filesystem.stage}/{doc.filesystem.configid}/{doc.filesystem.identifier}
              <div id="buttondiv-{doc._id}">
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
            {/if}
          </dt>
          <dd>
            {#if !('label' in doc)}
              <li>No item label found</li>
            {:else if !('_attachments' in doc) || !('dmd.xml' in doc._attachments)}
              <li>No dmd.xml found</li>
            {/if}
            {#if doc._id in ingestchecks}
              <li>
                <input
                  type="checkbox"
                  bind:checked={ingestchecks[doc._id]}
                  on:change={updateaiplist} />
                Ingest?
              </li>
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
