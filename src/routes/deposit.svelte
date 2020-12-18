<script>
  import TypeAhead from "../components/Couch/TypeAhead.svelte";
  import BulkLookup from "../components/Couch/BulkLookup.svelte";
  let id;
  let bulkId;
  var idInList = [];
  var idNotInList = [];

  function select(event) {
    id = event.detail.value;
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

<style>
  .container {
    display: flex;
  }
  p {
    display: inline-block;
    width: 140px;
    text-align: left;
  }
  .label {
    padding-bottom: 1%;
  }
  .label1 {
    padding-bottom: 1%;
  }
</style>

<svelte:head>
  <title>Sapindale — Deposit from preservation</title>
</svelte:head>
<h1>Deposit from preservation</h1>
<h2>Select one AIP</h2>
<div class="label">
  <TypeAhead
    db="dipstaging"
    id="aip"
    label="Input an AIP ID:"
    on:selected={select} />
</div>
<p>
  {#if id}Selected id: {id}{:else}Select an id by typing it in above.{/if}
</p>
<h2>Select multiple AIPs</h2>
<div class="label1">
  <BulkLookup
    db="dipstaging"
    id="aip"
    hasPrefix={true}
    label="List of AIP IDs, separated by newline"
    on:submit={search} />
</div>
<div>
  {#if bulkId !== undefined}
    <div class="container">
      <table>

        <th>List of Found ID's</th>
        {#each idInList as id}
          <tr>
            <td>{id}</td>
          </tr>
        {/each}
      </table>
      <table>
        <th>List of Not found ID's</th>
        {#each idNotInList as id}
          <tr>
            <td>{id}</td>
          </tr>
        {/each}

      </table>
    </div>
  {/if}
</div>
