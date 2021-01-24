<script>
  import {
    internalmetadocs,
    internalmetarequests,
    capcollectiondocs,
  } from "../couch/internalmeta";
  import { onMount } from "svelte";
  import { stores } from "@sapper/app";

  import PrefixSelector from "../components/util/PrefixSelector.svelte";

  const { session } = stores();
  let token = $session.token;

  export let depositor = "",
    hidefinder = false,
    findidentifiers = "",
    IDlist = [],
    selectedIDs = [],
    findnotfound = [],
    hidenotfound = false,
    docs = [],
    hidedocs = false,
    selected = {},
    hideactions = false,
    capcollections = [],
    approveaction = "",
    collectionsadd = [],
    collectionssub = [],
    actiontext = undefined,
    hidelegend = true;

  onMount(async () => {
    try {
      var capcols = await capcollectiondocs(token, {
        include_docs: true,
      });
      if (Array.isArray(capcols)) {
        var tempcollections = [];
        capcols.forEach(function (acol) {
          tempcollections.push(acol.doc);
        });
        capcollections = tempcollections;
      }
    } catch (ignore) {}
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

    // reset to defaults
    (selected = {}),
      (approveaction = ""),
      (collectionsadd = []),
      (collectionssub = []),
      (actiontext = undefined);

    var mydocs = await internalmetadocs(token, IDlist, { include_docs: true });
    if (!Array.isArray(mydocs)) {
      // TODO: Do something better for this error condition
      return;
    }
    var tempdocs = [];
    var tempids = [];
    var tempnotfound = [];
    mydocs.forEach(function (doc) {
      if ("doc" in doc) {
        selected[doc.doc._id] = true;
        tempdocs.push(doc.doc);
      } else {
        tempnotfound.push(doc.key);
      }
    });
    findnotfound = tempnotfound;
    docs = tempdocs;
    updateSelectedIDs();
  }

  function selectAll() {
    Object.keys(selected).forEach(function (key) {
      selected[key] = true;
    });
    updateSelectedIDs();
    docs = docs;
  }

  function unselectAll() {
    Object.keys(selected).forEach(function (key) {
      selected[key] = false;
    });
    updateSelectedIDs();
    docs = docs;
  }

  function updateSelectedIDs() {
    var tempids = [];
    Object.keys(selected).forEach(function (key) {
      if (selected[key] === true) {
        tempids.push(key);
      }
    });
    selectedIDs = tempids;
  }

  async function doAction() {
    var req = {};
    var text = [];
    if (approveaction !== "") {
      req.approved = approveaction === "approve";
      text.push(req.approved ? "approve" : "unapprove");
    }
    if (collectionsadd.length > 0) {
      req.collectionsadd = collectionsadd.join(",");
      text.push("add " + req.collectionsadd);
    }
    if (collectionssub.length > 0) {
      req.collectionssub = collectionssub.join(",");
      text.push("subtract " + req.collectionssub);
    }
    if (Object.keys(req).length > 0) {
      actiontext =
        "With " +
        selectedIDs.length +
        " identiers we will " +
        text.join(" and ") +
        ". Please wait....";

      await internalmetarequests(token, selectedIDs, req);
      await viewIDlist();
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
</script>

<svelte:head>
  <title>Internalmeta (approval, tagging, etc)</title>
</svelte:head>

<h1>Internalmeta (legacy access)</h1>

{#if capcollections.length > 0}
  <fieldset>
    <legend>
      (
      <label for="hidelegend">
        <input type="checkbox" id="hidelegend" bind:checked={hidelegend} />
        Hide?
      </label>
      ) Collection Tag legend
    </legend>
    {#if !hidelegend}
      <table>
        <tr>
          <th>tag</th>
          <th>label</th>
          <th>Summary</th>
        </tr>
        {#each capcollections as collection}
          <!-- This is a where a "display IIIF text value" function would come in handy. -->
          <tr>
            <td>{collection._id}</td>
            <td>{collection.label.en[0]}</td>
            <td>{collection.summary.en[0]}</td>
          </tr>
        {/each}
      </table>
    {/if}
  </fieldset>
{/if}

<fieldset>
  <legend>
    (
    <label for="hidefinder">
      <input type="checkbox" id="hidefinder" bind:checked={hidefinder} />
      Hide?
    </label>
    ) Select depositor:
    <PrefixSelector bind:prefix={depositor} />
  </legend>
  {#if !hidefinder}
    <textarea id="identifiers" bind:value={findidentifiers} />

    <button
      type="submit"
      on:click={() => {
        viewFind();
      }}> Find </button>
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
  {#if selectedIDs.length > 0}
    <fieldset>
      <legend>
        (
        <label for="hideactions">
          <input type="checkbox" id="hideactions" bind:checked={hideactions} />
          Hide?
        </label>
        ) With the selected IDs, do...
      </legend>

      {#if actiontext}
        {actiontext}
      {:else if !hideactions}
        <span class="children-inline">
          <select bind:value={approveaction}>
            <option value="">nothing</option>
            <option value="approve">approve</option>
            <option value="unapprove">unapprove</option>
          </select>
          and add
          <select multiple bind:value={collectionsadd} size="10">
            {#each capcollections as tag}
              <option value={tag._id}>{tag._id}</option>
            {/each}
          </select>
          and subtract
          <select multiple bind:value={collectionssub} size="10">
            {#each capcollections as tag}
              <option value={tag._id}>{tag._id}</option>
            {/each}
          </select>
          collection tags:
          <button
            type="submit"
            on:click={() => {
              doAction();
            }}> Do it </button>
        </span>
      {/if}
    </fieldset>
  {/if}

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
              }}> Select </button>
            /
            <button
              type="submit"
              on:click={() => {
                unselectAll();
              }}> unselect </button>
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
              <input
                type="checkbox"
                bind:checked={selected[doc._id]}
                on:change={updateSelectedIDs}
              />
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
                {doc.collections.join(",")}
              {/if}
            </td>
          </tr>
        {/each}
      </table>
    {/if}
  </fieldset>
{/if}
