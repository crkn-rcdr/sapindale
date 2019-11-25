<script>
  import TypeAhead, { value } from "../components/TypeAhead.svelte";
  import BulkLookup, { metaList } from "../components/BulkLookup.svelte";
  let id;
  let bulkId;
  var idInList = [];
  var idNotInList = [];

  function select(event) {
    id = event.detail.value;
  }
  function clear() {
    id = undefined;
  }
  function search(event) {
    bulkId = event.detail.metaList;
    let resultant = bulkId.rows.filter(row => row.id);
    let notfound = bulkId.rows.filter(row => !row.id);
    idInList = resultant.map(function(result) {
      return result.id;
    });
    idNotInList = notfound.map(function(result) {
      return result.key;
    });
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
<div class="pt-2">
  {#if bulkId !== undefined}
    <table>
      <th>List of Found ID's</th>
      {#each idInList as id}
        <tr>
          <td class="py-2 px-2">{id}</td>
        </tr>
      {/each}
      <th>List of Not found ID's</th>
      {#each idNotInList as id}
        <tr>
          <td class="py-2 px-2">{id}</td>
        </tr>
      {/each}
    </table>
  {/if}
</div>
