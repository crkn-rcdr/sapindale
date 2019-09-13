<script>
  import { onMount } from "svelte";
  import { state as authState } from "../auth.js";
  import { view } from "../couch.js";
  import { couchUrl } from "../couch.js";

  export let dbname, ddoc, viewname, options;
  export let viewContents = [];

  export let reduce = false;
  export let startkey;
  export let endkey;
  export let pathname;
  $: token = $authState.token;

  onMount(async () => {
    try {
      let response = await view(token, dbname, ddoc, viewname, options);
      viewContents = response.rows;
    } catch (err) {
      viewContents = [err];
    }
  });
  function method() {
    viewContents.forEach(function(viewcontent, index) {
      if (index === 0) {
        if (Array.isArray(viewcontent.key)) {
          startkey = JSON.stringify(viewcontent.key);
          endkey = JSON.stringify(viewContents[viewContents.length - 1].key);
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
      }
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
  <table id="table">
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
