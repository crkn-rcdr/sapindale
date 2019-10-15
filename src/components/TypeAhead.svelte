<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { state as authState } from "../auth.js";
  import { all_docs } from "../couch.js";
  const dispatch = createEventDispatcher();

  let token = $authState.token;

  export let db;
  let idFragment = "";
  let results = [];
  onMount(async () => {
    await lookupIds();
  });

  async function lookupIds(event) {
    dispatch("typeahead.iddeselected");
    try {
      results = (await all_docs(token, db, {
        startkey: JSON.stringify(idFragment),
        endkey: JSON.stringify(`${idFragment}\uFFEF`),
        limit: 12
      })).rows.filter(row => !row.key.startsWith("_design"));
    } catch (ignore) {
      results = ["Cannot retrieve results."];
    }
  }

  function selectId(event) {
    dispatch("typeahead.idselected", { id: idFragment });
  }
</script>

<style>
  input {
    border: 1px solid var(--brand-color);
    font-size: 120%;
    width: 30ch;
    padding: 10px;
  }
</style>

<div>
  <label for="typeaheadInput">Input a document ID:</label>
  <input
    type="text"
    id="typeaheadInput"
    list="typeaheadData"
    bind:value={idFragment}
    on:input={lookupIds}
    on:change={selectId} />
  <datalist id="typeaheadData">
    {#each results as result}
      <option>{result.id}</option>
    {/each}
  </datalist>
</div>
