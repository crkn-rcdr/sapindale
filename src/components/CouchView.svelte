<script>
  import { onMount } from "svelte";
  import { state as authState } from "../auth.js";
  import { view, all_docs } from "../couch.js";

  export let dbname, ddoc, viewname, options;
  export let viewContents = [];
  export let build = [];
  export let reduce = false;
  export let startkey;
  export let endkey;
  export let selectedVal;

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
        var cells = this.cells;
        updateKey = document.getElementById("tdata");
        updateKey.value = cells[0].innerHTML;
        selectedVal = updateKey.value;
        viewContents.forEach(function(viewcontent, index) {
          if (index === 0) {
            if (Array.isArray(viewcontent.key)) {
              startkey = JSON.stringify(selectedVal);
              console.log("start", startkey);
              endkey = JSON.stringify(
                viewContents[viewContents.length - 1].key
              );
              let options = {
                group: true,
                group_level: 1,
                startkey: startkey,
                endkey: endkey
              };
              let response = view(token, dbname, ddoc, viewname, options);
            } else {
              startkey = JSON.stringify(viewcontent.key);
              endkey = JSON.stringify(
                viewContents[viewContents.length - 1].key
              );
              let options = {
                group: false,
                reduce: false,
                startkey: startkey,
                endkey: endkey
              };
              let response = view(token, dbname, ddoc, viewname, options);
            }
          }
        });
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
{/if}
