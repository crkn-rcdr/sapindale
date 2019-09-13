<script>
  import { onMount } from "svelte";
  import { state as authState } from "../auth.js";
  import { all_docs } from "../couch.js";
  let token = $authState.token;

  export let db;
  let value = "";
  let results = [];

  onMount(async () => {
    await keyup();
  });

  let keyup = async _event => {
    try {
      results = (await all_docs(token, db, {
        startkey: JSON.stringify(value),
        endkey: JSON.stringify(`${value}\uFFEF`),
        limit: 20
      })).rows.filter(row => !row.key.startsWith("_design"));
    } catch (ignore) {
      results = ["Cannot retrieve results."];
    }
  };
</script>

<style>
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
  }
</style>

<div>
  <input type="text" bind:value on:keyup={keyup} />
  <ul>
    {#each results as result}
      <li>{result.id}</li>
    {/each}
  </ul>
</div>
