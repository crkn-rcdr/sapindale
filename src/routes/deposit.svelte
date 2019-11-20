<script>
  import TypeAhead, { value } from "../components/TypeAhead.svelte";
  import BulkLookup, { metaIdList } from "../components/BulkLookup.svelte";
  let id;

  function select(event) {
    id = event.detail.value;
  }
  function clear() {
    id = undefined;
  }
  function search(event) {
    id = event.detail.metaIdList;
    console.log("in deposit", id);
  }
</script>

<svelte:head>
  <title>Sapindale — Deposit from preservation</title>
</svelte:head>
<div class="mx-auto">
  <h1>Deposit from preservation</h1>
  <div>
    <TypeAhead
      db="dipstaging"
      id="aip"
      label="Input an AIP ID:"
      on:selected={select}
      on:deselected={clear} />
  </div>
  <p>
    {#if id}Selected id: {id}{:else}Select an id by typing it in above.{/if}
  </p>
</div>
<div>
  <BulkLookup
    db="dipstaging"
    id="aip"
    label="Paste your ID's to lookup"
    on:submit={search} />
</div>
<div>
  {#if id !== undefined}
    <table>
      <th>List of ID's</th>
      <tr>
        <td class="py-2 px-2">{id}</td>
      </tr>
    </table>
  {/if}
</div>
