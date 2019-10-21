<script>
  import { onMount } from "svelte";
  import { state as authState } from "../auth.js";
  import { view, all_docs } from "../couch.js";
  import CouchViewTable, { data } from "../components/CouchViewTable.svelte";
  import SelectedView, { result } from "../components/SelectedView.svelte";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let dbname, ddoc, viewname, options;
  export let viewContents = [];
  export let group_level = 1;
  export let selectedVal = [];
  let response = [];

  let showResult = true;
  $: token = $authState.token;
  onMount(async () => {
    await retrieveKey();
  });

  async function retrieveKey(event) {
    try {
      response = await view(token, dbname, ddoc, viewname, options);

      viewContents = response.rows;
    } catch (err) {
      viewContents = [err];
    }
  }

  function selectKey(event) {
    let startkey = event.detail.text;

    let endkey = viewContents[viewContents.length - 1].key;
    let endKeyValue = `["${endkey},{}"]`;

    let newOptions = {
      group: true,
      group_level: group_level,
      startkey: JSON.stringify(startkey),
      endkey: endKeyValue
    };

    let response = view(token, dbname, ddoc, viewname, newOptions).then(
      function(response) {
        selectedVal = response.rows;
        return response.rows;
      }
    );
    showResult = false;
  }
  function previousResult(event) {
    showResult = true;
  }
</script>

<style>
  table {
    margin-top: 5em;
    width: 10%;
    border: 1px solid brown;
  }
  button {
    float: right;
  }
</style>

{#if showResult == false}
  <button on:click={previousResult}>Previous</button>
{/if}
{#if $authState.status === 'SUCCESS'}
  {#if showResult}
    <table id="table">
      <label for="group_level">Group Level</label>
      <input type="number" bind:value={group_level} />
      {#each viewContents as data}
        <CouchViewTable {data} on:message={selectKey} />
      {/each}
    </table>
  {/if}
{/if}
<ul>
  {#if showResult == false}
    {#each selectedVal as result}
      <SelectedView {result} />
    {/each}
  {/if}
</ul>
