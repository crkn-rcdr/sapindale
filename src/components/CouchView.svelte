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
  export let endkeyIn;
  export let selectedVal;

  $: token = $authState.token;
  //$: key = $value;
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
        //console.log("Row Index: ", this.rowIndex);

        if (Array.isArray(viewContents[rowNumber - 1].key)) {
          startkey = viewContents[rowNumber - 1].key;
          // console.log("s", startkey);
          viewContents.forEach(item => {
            (endkeyIn = item.key), item.key.push({});
            endkey = endkeyIn;
          });
          //console.log("endK", endkey);

          let options = {
            group: true,
            group_level: 1,
            startkey: startkey,
            endkey: endkey
          };
          let response = view(token, dbname, ddoc, viewname, options);
        } else {
          startkey = JSON.stringify(viewcontent.key);
          endkey = JSON.stringify(viewContents[viewContents.length - 1].key);
          let options = {
            group: false,
            reduce: false,
            startkey: startkey,
            endkey: endkey
          };
          let response = view(token, dbname, ddoc, viewname, options);
        }
      };
      //   });
    }
  }
  // }
  function handleClear() {}
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
