<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { state as authState } from "../auth.js";
  import { all_docs } from "../couch.js";
  import Option from "./TypeAhead/Option.svelte";
  const dispatch = createEventDispatcher();

  let token = $authState.token;

  export let db;
  let idFragment = "";
  let results = [];
  var showResults = true;
  onMount(async () => {
    await lookupIds();
  });

  async function lookupIds(event) {
    if (
      event &&
      event.key == "Enter" &&
      results[0] &&
      results[0].id == idFragment
    ) {
      dispatch("typeahead.idselected", { id: idFragment });
      showResults = false;
    } else {
      dispatch("typeahead.iddeselected");
      try {
        results = (await all_docs(token, db, {
          startkey: JSON.stringify(idFragment),
          endkey: JSON.stringify(`${idFragment}\uFFEF`),
          limit: 20
        })).rows.filter(row => !row.key.startsWith("_design"));
      } catch (ignore) {
        results = ["Cannot retrieve results."];
      }
      showResults = true;
    }
  }

  function selectId(event) {
    idFragment = event.detail.id;
    showResults = false;
  }
</script>

<style>
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    font-size: 16px;
  }
  input {
    border: 1px solid var(--brand-color);
  }
</style>

<div>
  <input
    type="text"
    bind:value={idFragment}
    on:keyup={lookupIds}
    placeholder="Search" />
  {#if showResults}
    <ul>
      {#each results as result}
        <Option
          id={result.id}
          on:typeahead.idselected
          on:typeahead.idselected={selectId} />
      {/each}
    </ul>
  {/if}
</div>
