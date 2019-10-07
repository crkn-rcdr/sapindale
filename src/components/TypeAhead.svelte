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
  function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement;
  }
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
    var ul = document.getElementById("test");
    ul.onclick = function(event) {
      var target = getEventTarget(event);
      value = target.innerHTML;
    };
  };
</script>

<style>
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .highlight li {
    position: relative;
    list-style: none;
    line-height: 1.8em;
    cursor: pointer;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }

  .highlight li:hover {
    color: #98012e;
  }

  .highlight li:after {
    position: absolute;
    top: 2.1em;
    left: 0.9em;
    width: 2px;
    height: calc(100% - 2em);
    content: "";
    z-index: 0;
  }
</style>

<div>
  <input type="text" bind:value on:keyup={keyup} />
  <ul id="test" class="highlight">
    {#each results as result}
      <li class="highlight">{result.id}</li>
    {/each}
  </ul>
</div>
