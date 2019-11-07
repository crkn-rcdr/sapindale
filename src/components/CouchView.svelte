<script>
  import qs from "query-string";
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";
  import { design_doc_views as getViews, view as fetchView } from "../couch.js";
  import { state as authState } from "../auth.js";

  export let db = undefined,
    view = undefined, // if the view is found at '_design/$ddoc/_view/$v', this will be '$ddoc/$v'
    options = {};

  let token = $authState.token;
  let views = {};

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
    history.pushState(
      { id: history.state.id + 1 },
      "",
      `/couchview/${db}/${view}?${qs.stringify(options)}`
    );
    await loadView();
  }
</script>

<style>
  .controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1.5rem;
  }

</style>

<div class="container mx-auto">
  <h1>Couch view display</h1>

  <div class="controls layout">
    <div>
      <label for="db.select">Database:</label>
      <select id="db.select" bind:value={db} on:change={reselectView}>
        {#each Object.keys(views) as database}
          <option selected={database === db}>{database}</option>
        {/each}
      </select>
      <br />
      <label for="view.select">View:</label>
      <select id="view.select" bind:value={view} disabled={!db}>
        {#if db && views[db]}
          {#each Object.keys(views[db]) as ddoc (ddoc)}
            <optgroup label={ddoc}>
              {#each views[db][ddoc] as v}
                <option
                  value={`${ddoc}/${v}`}
                  selected={`${ddoc}/${v}` === view}>
                  {v}
                </option>
              {/each}
            </optgroup>
          {/each}
        {/if}
      </select>
    </div>
    <div>
      <label for="startkeyInput">Start key:</label>
      <input type="text" id="startkeyInput" bind:value={options.startkey} />
      <br />
      <label for="endkeyInput">End key:</label>
      <input type="text" id="endkeyInput" bind:value={options.endkey} />
      <label for="inclusiveCheck">Inclusive?</label>
      <input
        type="checkbox"
        id="inclusiveCheck"
        bind:checked={options.inclusive} />
      <br />
      <label for="reduceCheck">Reduce?</label>
      <input type="checkbox" id="reduceCheck" bind:checked={options.reduce} />
      
      {#if options.reduce}
        <label for="groupInput">Grouping level:</label>
        <input
          type="number"
          min="0"
          max="9"
          id="groupInput"
          bind:value={options.group} />
      {/if}
      <div>
      <label for="limitInput">Limit:</label>
      <input
        type="number"
        min="100"
        max="500"
        step="100"
        id="limitInput"
        bind:value={options.limit} />
        </div>  
    <button on:click={update}>Update</button>
    </div>
    </div>
  
  {#if viewContents.length > 0}
    <h2>View output</h2>
    <table class="layout text-left w-full border-collapse">
      <thead>
        <th>Key</th>
        <th>Value</th>
      </thead>
      <tbody>
        {#each viewContents as row}
          <tr>
            <td class="py-2 px-2">{JSON.stringify(row.key)}</td>
            <td class="py-2 px-2">{JSON.stringify(row.value)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
