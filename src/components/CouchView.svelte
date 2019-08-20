<script>
  import { onMount } from "svelte";
  import { state as authState } from "../auth.js";
  import { view } from "../couch.js";

  export let dbname, ddoc, viewname, options;
  export let viewContents = [];
  $: token = $authState.token;

  onMount(async () => {
    try {
      let response = await view(token, dbname, ddoc, viewname, options);
      viewContents = response.rows;
    } catch (err) {
      viewContents = [err];
    }
  });
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

{#if $authState.status === 'SUCCESS'}
  <table>
    <tr>
      <th>{viewname}</th>
    </tr>
    {#each viewContents as data}
      <tr>
        <td>{data.key}</td>
        <td>{data.value}</td>
      </tr>
    {/each}
  </table>
{/if}
