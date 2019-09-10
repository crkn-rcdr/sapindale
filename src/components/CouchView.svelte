<script>
  import { onMount } from "svelte";
  import { state as authState } from "../auth.js";
  import { view } from "../couch.js";
  import { couchUrl } from "../couch.js";

  export let dbname, ddoc, viewname, options;
  export let viewContents = [];
  export let kval;
  //export let viewReduce = [];
  export let reduce = false;
  export let startkey;
  export let endkey;
  export let pathname;
  $: token = $authState.token;

  onMount(async () => {
    try {
      let response = await view(token, dbname, ddoc, viewname, options);
      kval = response;
      viewContents = response.rows;
    } catch (err) {
      startkey;
      viewContents = [err];
    }
  });
  function method(reduce, startkey, endkey) {
    viewContents.forEach(function(viewcontent, index) {
      console.log("Index of for each:" + index);
      if (index === 0) {
        if (Array.isArray(viewcontent.key)) {
          startkey = viewcontent.key;
          endkey = viewContents[viewContents.length - 1].key;
          pathname =
            couchUrl +
            "/" +
            dbname +
            "/" +
            "_design" +
            "/" +
            ddoc +
            "/" +
            "_view" +
            "/" +
            viewname +
            "/reduce=false?startkey=" +
            startkey +
            "?endkey=" +
            endkey;
          console.log("Path name :" + pathname);
          window.location.pathname = pathname;

          console.log(
            "viewcontent is an array " + startkey + "End Key" + endkey
          );
        } else {
          startkey = viewcontent.key;
          endkey = viewContents[viewContents.length - 1].key;
          console.log("Viewcontent is of type :" + typeof viewcontent.key);
        }
      }
      if (Array.isArray(viewcontent)) {
        //window.location.pathname = "/reduce=false?startkey=key";
      }
      console.log("view1", kval);
    });
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
  <table>
    <tr>
      <th>{viewname}</th>
    </tr>
    {#each viewContents as data}
      <tr>
        <td on:click={method}>
          {data.key}
          <!-- <a href="/coltCollection">{data.key}</a> -->
        </td>
        <td>{data.value}</td>
      </tr>
    {/each}
  </table>
{/if}
[]
