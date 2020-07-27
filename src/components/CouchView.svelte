<script>
  import qs from "query-string";
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";
  import { design_doc_views as getViews, view as fetchView } from "../couch.js";
  import { state as authState } from "../auth.js";

  export let db = undefined,
    view = undefined, // if the view is found at '_design/$ddoc/_view/$v', this will be '$ddoc/$v'
    options = {};

  normalizeOptions();

  let token = $authState.token;
  let views = {};
  let onlyIDs = false;

  onMount(async () => {
    try {
      views = await getViews(token);
    } catch (ignore) {}

    if (db && view) {
      await loadView();
    }

    if (!db) db = Object.keys(views)[0];
    if (!view) reselectView();

    window.onpopstate = loadView;
  });

  function normalizeOptions() {
    if (!options.reduce) {
      delete options.group;
    }

    if (options.range) {
      delete options.key;
    } else {
      delete options.startkey;
      delete options.endkey;
    }
    if ("keytype" in options && options.keytype === "number") {
      if ("key" in options && typeof options.key !== "number") {
        options.key = parseInt(options.key);
        if (isNaN(options.key)) {
          delete options.key;
        }
      }
      if ("startkey" in options && typeof options.startkey !== "number") {
        options.startkey = parseInt(options.startkey);
        if (isNaN(options.startkey)) {
          delete options.startkey;
        }
      }
      if ("endkey" in options && typeof options.endkey !== "number") {
        options.endkey = parseInt(options.endkey);
        if (isNaN(options.endkey)) {
          delete options.endkey;
        }
      }
    }
  }

  function reselectView() {
    let ddoc = Object.keys(views[db])[0];
    view = `${ddoc}/${views[db][ddoc][0]}`;
  }

  let viewContents = [];
  async function loadView() {
    function inclusiveArray(key) {
      return key.concat([{}]);
    }
    function inclusiveString(key) {
      return `${key}\uFEFF`;
    }

    function parsedKey(key, inclusive = false) {
      let parsedKey;
      try {
        parsedKey = JSON.parse(key);
      } catch (ignore) {}
      if (Array.isArray(parsedKey)) {
        return inclusive ? inclusiveArray(parsedKey) : parsedKey;
      } else {
        return inclusive ? inclusiveString(key) : key;
      }
    }

    let couchOptions = {
      startkey: options.startkey
        ? JSON.stringify(parsedKey(options.startkey))
        : undefined,
      endkey: options.endkey
        ? JSON.stringify(parsedKey(options.endkey, options.inclusive))
        : undefined,
      key: options.key ? JSON.stringify(parsedKey(options.key)) : undefined,
      reduce: options.reduce,
      group_level: options.reduce ? options.group : undefined,
      limit: options.limit
    };

    if (db && view) {
      viewContents = await fetchView(
        token,
        db,
        ...view.split("/"),
        couchOptions
      );
    }
  }

  async function update() {
    normalizeOptions();
    onlyIDs = false;

    history.pushState(
      { id: history.state.id + 1 },
      "",
      `/couchview/${db}/${view}?${qs.stringify(options)}`
    );

    await loadView();
  }

  async function viewKey(key = "") {
    switch (typeof key) {
      case "number":
        options.keytype = "number";
        options.range = false;
        options.key = key;
        delete options.startkey;
        delete options.endkey;
        delete options.inclusive;
        break;

      case "string":
        options.keytype = "string";
        options.range = false;
        options.key = key;
        delete options.startkey;
        delete options.endkey;
        delete options.inclusive;
        break;

      default:
        options.keytype = "json";
        key = JSON.stringify(key);
        options.range = true;
        options.startkey = key;
        options.endkey = key;
        options.inclusive = true;
        delete options.key;
    }
    options.reduce = false;
    await update();
  }
</script>

<style>
  .controls {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
</style>

<h1>Couch view display</h1>

<h2>Controls</h2>
<div class="controls">
  <div>
    <label for="db.select">Database</label>
    <select
      class="data-list border"
      id="db.select"
      bind:value={db}
      on:change={reselectView}>
      {#each Object.keys(views) as database}
        <option selected={database === db}>{database}</option>
      {/each}
    </select>
    <br />
    <label for="view.select">View</label>
    <select
      class="data-list border"
      id="view.select"
      bind:value={view}
      disabled={!db}>
      {#if db && views[db]}
        {#each Object.keys(views[db]) as ddoc (ddoc)}
          <optgroup label={ddoc}>
            {#each views[db][ddoc] as v}
              <option value={`${ddoc}/${v}`} selected={`${ddoc}/${v}` === view}>
                {v}
              </option>
            {/each}
          </optgroup>
        {/each}
      {/if}
    </select>
    <br />
    <br />
    <button on:click={update}>Update</button>
  </div>
  <div>
    <label for="typeselect">Key type</label>
    <select id="typeselect" bind:value={options.keytype}>
      <option value="json">JSON structure</option>
      <option value="string">String</option>
      <option value="number">Number</option>
    </select>
    <br />
    <label for="rangeCheck">Range?</label>
    <input type="checkbox" id="rangeCheck" bind:checked={options.range} />
    <br />
    {#if options.range}
      <label for="startkeyInput">Start key</label>
      <input
        type="text"
        class="data-list border"
        id="startkeyInput"
        bind:value={options.startkey} />
      <br />
      <label for="endkeyInput">End key</label>
      <input
        type="text"
        class="data-list border"
        id="endkeyInput"
        bind:value={options.endkey} />
      <br />
      <label for="inclusiveCheck">Make end key inclusive?</label>
      <input
        type="checkbox"
        class="data-list border"
        id="inclusiveCheck"
        bind:checked={options.inclusive} />
    {:else}
      <label for="keyInput">Key</label>
      <input
        type="text"
        class="data-list border"
        id="keyInput"
        bind:value={options.key} />
      <br />
    {/if}
  </div>
  <div>
    <label for="reduceCheck">Reduce?</label>
    <input type="checkbox" id="reduceCheck" bind:checked={options.reduce} />
    <br />
    {#if options.reduce}
      <label for="groupInput">Grouping level:</label>
      <input
        type="number"
        class="data-list border"
        min="0"
        max="9"
        id="groupInput"
        bind:value={options.group} />
      <br />
    {/if}
    <label for="limitInput">Limit</label>
    <input
      type="number"
      class="data-list border"
      min="100"
      max="500"
      step="100"
      id="limitInput"
      bind:value={options.limit} />
  </div>
</div>

{#if viewContents.length > 0}
  <h2>Output</h2>
  {#if viewContents[0].id}
    <div>
      <label for="onlyIDs">Hide keys and values</label>
      <input type="checkbox" id="onlyIDs" bind:checked={onlyIDs} />
    </div>
  {/if}
  <table class="border-collapse">
    <thead>
      {#if !onlyIDs}
        <th>Key</th>
        <th>Value</th>
      {/if}
      {#if viewContents[0].id}
        <th>ID</th>
      {/if}
    </thead>
    <tbody>
      {#each viewContents as row}
        <tr>
          {#if !onlyIDs}
            {#if options.reduce}
              <td>
                <button
                  on:click={() => {
                    viewKey(row.key);
                  }}>
                  {JSON.stringify(row.key)}
                </button>
              </td>
            {:else}
              <td>{JSON.stringify(row.key)}</td>
            {/if}
            <td>{JSON.stringify(row.value)}</td>
          {/if}
          {#if row.id}
            <td>{row.id}</td>
          {/if}
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
