<script>
  import { internalmetadocs, capcollectiondocs } from "../couch.js";
  import { onMount } from "svelte";
  import { state as authState } from "../auth.js";

  let token = $authState.token;

  // This should eventually be in a common place
  export let depositors = [
      {
        id: "ams",
        name: "Shortgrass Public Library System"
      },
      {
        id: "omcn",
        name: "Mississauga Library System"
      },
      {
        id: "oocihm",
        name: "Canadiana.org"
      },
      {
        id: "ooe",
        name: "Department of Foreign Affairs Trade and Development"
      },
      {
        id: "oop",
        name: "Library of Parliament"
      },
      {
        id: "carl",
        name: "Canadian Association of Research Libraries"
      },
      {
        id: "numeris",
        name: "Numeris - broadcast measurement and consumer behaviour data"
      },
      {
        id: "osmsdga",
        name: "South Mountain"
      },
      {
        id: "ooga",
        name: "Canadian Hazards Information Service"
      },
      {
        id: "qmma",
        name: "McGill University Archives"
      }
    ],
    depositor = "",
    hidefinder = false,
    findidentifiers = "",
    IDlist = [],
    findnotfound = [],
    hidenotfound = false,
    docs = [],
    hidedocs = false,
    approved = {},
    hideactions = false,
    capcollections = [],
    tags = [];

  onMount(async () => {
    try {
      var capcols = await capcollectiondocs(token, {
        include_docs: false
      });
      if (Array.isArray(capcols)) {
        var tempcollections = [];
        capcols.forEach(function(acol) {
          tempcollections.push(acol.id);
        });
        capcollections = tempcollections;
      }
    } catch (ignore) {};
    console.log(capcollections);
  });

  async function viewFind() {
    findidentifiers.replace(/["]/g, "");
    var IDs = findidentifiers.split(/[,|\s]/);
    var tempidlist = [];

    for (var index in IDs) {
      var currentID = IDs[index];
      if (/\S/.test(currentID)) {
        if (depositor !== "" && currentID.indexOf(".") === -1) {
          currentID = depositor + "." + currentID;
        }
        tempidlist.push(currentID);
      }
    }
    IDlist = tempidlist;
    await viewIDlist();
  }

  async function viewIDlist() {
    var tempids = [],
      tempnotfound = [];

    approved = {}; // reset to default
    var mydocs = await internalmetadocs(token, IDlist, { include_docs: true });
    if (!Array.isArray(mydocs)) {
      // TODO: Do something better for this error condition
      return;
    }
    var tempdocs = [];
    var tempids = [];
    var tempnotfound = [];
    mydocs.forEach(function(doc) {
      if ("doc" in doc) {
        approved[doc.doc._id] = "approved" in doc.doc;
        tempdocs.push(doc.doc);
      } else {
        tempnotfound.push(doc.key);
      }
    });
    findnotfound = tempnotfound;
    docs = tempdocs;
  }

  function selectAll() {
    Object.keys(approved).forEach(function(key) {
      approved[key] = true;
    });
    docs = docs;
  }

  function unselectAll() {
    Object.keys(approved).forEach(function(key) {
      approved[key] = false;
    });
    docs = docs;
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

<h1>Internalmeta (legacy access)</h1>

<fieldset>
  <legend>
    (
    <label for="hidefinder">
      <input type="checkbox" id="hidefinder" bind:checked={hidefinder} />
      Hide?
    </label>
    ) Select depositor:
    <select bind:value={depositor}>
      <option value="" />
      {#each depositors as thisdepositor}
        <option value={thisdepositor.id}>{thisdepositor.name}</option>
      {/each}
    </select>
    {#if depositor !== ''}({depositor}){/if}

  </legend>
  {#if !hidefinder}
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
  {/if}
</fieldset>

{#if findnotfound.length > 0}
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
          <li>{notfoundid}</li>
        {/each}
      </ul>
    {/if}
  </fieldset>
{/if}

{#if docs.length > 0}
  <fieldset>
    <legend>
      (
      <label for="hideactions">
        <input type="checkbox" id="hideactions" bind:checked={hideactions} />
        Hide?
      </label>
      ) Actions
    </legend>
    {#if !hideactions}

      <select multiple bind:value={tags} size="10">
        {#each capcollections as tag}
          <option value={tag}>{tag}</option>
        {/each}
      </select>
    {/if}

  </fieldset>

  <fieldset>
    <legend>
      (
      <label for="hidedocs">
        <input type="checkbox" id="hidedocs" bind:checked={hidedocs} />
        Hide?
      </label>
      ) Internalmeta documents
    </legend>
    {#if !hidedocs}
      <table>
        <tr>
          <th>
            <button
              type="submit"
              on:click={() => {
                selectAll();
              }}>
              Select
            </button>
            /
            <button
              type="submit"
              on:click={() => {
                unselectAll();
              }}>
              unselect
            </button>
            all
          </th>
          <th>ID</th>
          <th>Approved</th>
          <th>Unapproved</th>
          <th>Collection tags</th>
        </tr>
        {#each docs as doc}
          <tr>
            <td>
              <input type="checkbox" bind:checked={approved[doc._id]} />
            </td>
            <td>{doc._id}</td>
            <td>
              {#if doc.approved}{doc.approved}{/if}
            </td>
            <td>
              {#if doc.unapproved}{doc.unapproved}{/if}
            </td>
            <td>
              {#if Array.isArray(doc.collections)}
                {doc.collections.join(',')}
              {/if}
            </td>
          </tr>
        {/each}
      </table>
    {/if}
  </fieldset>
{/if}
