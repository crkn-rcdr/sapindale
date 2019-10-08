<script>
  import { onMount } from "svelte";
  import { state as authState } from "../auth.js";
  import { all_docs } from "../couch.js";
  import Option from "./TypeAhead/Option.svelte";

  let token = $authState.token;

  export let db;
  let value = "";
  let results = [];
  var showResults = true;
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
    showResults = true;
  };
  function selectId(event) {
    value = event.detail.text;
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
    width: 150px;
    height: 25px;
    box-sizing: border-box;
    border: 1px solid #98012e;

    -webkit-transition: width 0.4s ease-in-out;
    transition: width 0.4s ease-in-out;
  }
  input[type="text"]:focus {
    width: 30%;
  }
</style>

<div>
  <input type="text" bind:value on:keyup={keyup} placeholder="Search" />
  {#if showResults}
    <ul id="test" class="highlight">
      {#each results as result}
        <Option id={result.id} on:message={selectId} />
      {/each}
    </ul>
  {/if}
</div>
