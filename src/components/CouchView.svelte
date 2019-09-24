<script>
  import { onMount } from "svelte";
  import { state as authState } from "../auth.js";
  import { view, all_docs } from "../couch.js";

  export let dbname, ddoc, viewname, options;
  export let viewContents = [];
  export let group_level = 1;
  export let startkey;
  export let endkey;
  export let endkeyIn;
  export let selectedVal = [];

  $: token = $authState.token;
  onMount(async () => {
    try {
      let response = await view(token, dbname, ddoc, viewname, options);
      viewContents = response.rows;
    } catch (err) {
      viewContents = [err];
    }
  });

  function reduceView() {
    var updateKey;
    var tabRecords = document.getElementById("table");
    var rows = tabRecords.rows;
    for (var i = 0; i < rows.length; i++) {
      rows[i].onclick = function() {
        if (this.parentNode.nodeName == "THEAD") {
          return;
        }
        var rowNumber = this.rowIndex;
        if (Array.isArray(viewContents[rowNumber - 1].key)) {
          startkey = JSON.stringify(viewContents[rowNumber - 1].key);
          viewContents.forEach(item => {
            (endkeyIn = item.key), item.key.push({});
            endkey = JSON.stringify(endkeyIn);
          });

          let newOptions = {
            group: true,
            group_level: group_level,
            startkey: startkey,
            endkey: endkey
          };
          let response = view(token, dbname, ddoc, viewname, newOptions).then(
            function(response) {
              selectedVal = response.rows;
              return response.rows;
            }
          );
        } else {
          startkey = JSON.stringify(viewcontent.key);
          endkey = JSON.stringify(viewContents[viewContents.length - 1].key);
          let options = {
            group: false,
            reduce: false,
            startkey: startkey,
            endkey: endkey`\uFFEF`
          };
          let response = view(token, dbname, ddoc, viewname, options);
        }
      };
    }
  }
</script>

<style>
  table {
    margin-top: 5em;
    width: 10%;
    border: 1px solid brown;
  }
  tr,
  td {
    align-self: auto;
    border: 1px solid brown;
  }

  th {
    text-align: justify;
  }
</style>

<!-- <slot>{viewContents}</slot> -->

{#if $authState.status === 'SUCCESS'}
  <table id="table">
    <label for="group_level">Group Level</label>
    <input type="number" bind:value={group_level} />
    <tr>
      <th>{viewname}</th>
    </tr>
    {#each viewContents as data}
      <tr>
        <td id="tdata" on:click={reduceView}>{data.key}</td>
        <td>{data.value}</td>
      </tr>
    {/each}
  </table>
  <ul>
    {#each selectedVal as result}
      <li>{result.key} {result.value}</li>
    {/each}
  </ul>
{/if}
