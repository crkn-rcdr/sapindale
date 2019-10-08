<script>
  import { onMount } from "svelte";
  import { state as authState } from "../auth.js";
  import { all_docs } from "../couch.js";
  import Option from "../components/Option.svelte";
  import selectedId from "../components/Option.svelte";

  let token = $authState.token;

  export let db;
  export let value = "";
  export let results = [];
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
  };
  function selectId(event) {
    value = event.detail.text;
    showResults = false;
  }
  function refresh() {
    showResults = true;
    value = "";
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
  button {
    display: inline-block;
    padding: 5px 5px;
    font-size: 14px;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    outline: none;
    color: #fff;
    background-color: #98012e;
    border: none;
    border-radius: 10px;
    box-shadow: 0 9px #999;
  }
  button:hover {
    background-color: #55011a;
  }
  button:active {
    background-color: #55011a;
    box-shadow: 0 5px #999;
    transform: translateY(4px);
  }
</style>

<div>
  <input type="text" bind:value on:keyup={keyup} placeholder="Search" />
  <button type="reset" on:click={refresh}>Refresh</button>
  {#if showResults}
    <ul id="test" class="highlight">
      {#each results as result}
        <Option id={result.id} on:message={selectId} />
      {/each}
    </ul>
  {/if}
</div>
