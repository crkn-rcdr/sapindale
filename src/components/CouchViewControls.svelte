<script>
  import TypeAhead from "./TypeAhead.svelte";
  import qs from "query-string";
  import { goto } from "@sapper/app";
  export let db = undefined,
    ddoc = undefined,
    view = undefined,
    options = {};

  console.log(
    `controls initialized with: ${db}, ${ddoc}, ${view}, ${JSON.stringify(
      options
    )}`
  );

  async function update() {
    console.log(options);
    if (db && ddoc && view) {
      await goto(`couchview/${db}/${ddoc}/${view}?${qs.stringify(options)}`);
    }
  }
</script>

<style>
  .controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
</style>

<div class="controls">
  <div>
    <TypeAhead
      label="Database:"
      mode="databases"
      value={db ? db : ''}
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
        value={ddoc ? ddoc : ''}
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
        value={view ? view : ''}
        on:selected={e => {
          view = e.detail.value;
        }}
        on:deselected={() => {
          view = undefined;
        }} />
    {/if}
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
    <br />
    <label for="limitInput">Limit:</label>
    <input
      type="number"
      min="100"
      max="500"
      step="100"
      id="limitInput"
      bind:value={options.limit} />
    <button on:click={update}>Update</button>
  </div>
</div>
