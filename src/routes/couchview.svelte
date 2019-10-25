<script>
  import TypeAhead from "../components/TypeAhead.svelte";
  import { state as authState } from "../auth.js";
  import { view as fetchView } from "../couch.js";
  let db, ddoc, view, startkey, endkey, inclusive, group, reduce;

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

  $: options = {
    startkey: startkey ? JSON.stringify(parsedKey(startkey)) : undefined,
    endkey: endkey ? JSON.stringify(parsedKey(endkey, inclusive)) : undefined,
    reduce,
    group_level: group
  };

  let token = $authState.token;
  let viewContents;
  async function update() {
    if (db && ddoc && view) {
      console.log(options);
      let sanitizedOptions = Object.keys(options).reduce((acc, key) => {
        if (options[key] !== undefined) acc[key] = options[key];
        return acc;
      }, {});
      viewContents = await fetchView(token, db, ddoc, view, sanitizedOptions);
    }
  }
</script>

<svelte:head>
  <title>Sapindale — Couch view output</title>
</svelte:head>

<h1>Couch view output</h1>

<div class="controls">
  <TypeAhead
    label="Database:"
    mode="databases"
    on:selected={e => {
      db = e.detail.value;
    }}
    on:deselected={() => {
      db = undefined;
    }} />
  {#if db}
    <TypeAhead
      label="Design document:"
      mode="design_docs"
      {db}
      on:selected={e => {
        ddoc = e.detail.value;
      }}
      on:deselected={() => {
        ddoc = undefined;
      }} />
  {/if}
  {#if db && ddoc}
    <TypeAhead
      label="View:"
      mode="design_doc_views"
      {db}
      {ddoc}
      on:selected={e => {
        view = e.detail.value;
      }}
      on:deselected={() => {
        view = undefined;
      }} />
  {/if}

  <label for="startkeyInput">Start key:</label>
  <input type="text" id="startkeyInput" bind:value={startkey} />
  <br />
  <label for="endkeyInput">End key:</label>
  <input type="text" id="endkeyInput" bind:value={endkey} />
  <label for="inclusiveCheck">Inclusive?</label>
  <input type="checkbox" id="inclusiveCheck" bind:checked={inclusive} />
  <br />
  <label for="reduceCheck">Reduce?</label>
  <input type="checkbox" id="reduceCheck" bind:checked={reduce} />
  {#if reduce}
    <label for="groupInput">Grouping level:</label>
    <input type="number" min="0" max="9" id="groupInput" bind:value={group} />
  {/if}
  <br />
  <button on:click={update}>Update</button>
</div>

<p>{JSON.stringify(options)}</p>
<p>{JSON.stringify(viewContents)}</p>
