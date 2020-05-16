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
    move = {},
    ingestchecks = {},
    aiplist = undefined,
    aiplistview = undefined;

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
    console.log("UpdateAIPList", aiplist, aiplistview, ingestchecks);
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
      <legend>Manipulate AIPs in list</legend>
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
          </dd>
        {/each}
      </dl>
    {/if}
  </fieldset>
{/if}
