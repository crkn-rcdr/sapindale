<script>
  import TypeAhead from "../components/TypeAhead.svelte";
  import BulkLookup from "../components/BulkLookup.svelte";
  import SortableList from "svelte-sortable-list/SortableList.svelte";
  import ManifestView from "../components/ManifestView.svelte";
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
    console.log(event);
    bulkId = event.detail.results;
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
<h1>Deposit from preservation</h1>
<h2>Select one AIP</h2>
<TypeAhead
  db="dipstaging"
  id="aip"
  label="Input an AIP ID:"
  on:selected={select}
  on:deselected={clear} />
<p>
  {#if id}Selected id: {id}{:else}Select an id by typing it in above.{/if}
</p>
<h2>Select multiple AIPs</h2>
<BulkLookup
  db="dipstaging"
  id="aip"
  hasPrefix={true}
  label="List of AIP IDs, separated by newline"
  on:submit={search} />
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

<ManifestView />
