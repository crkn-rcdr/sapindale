<script>
  import TypeAhead, { value } from "../components/TypeAhead.svelte";
  let id;
  function select(event) {
    id = event.detail.id;
  }
  function clear() {
    id = undefined;
  }
</script>

<svelte:head>
  <title>Sapindale — Deposit from preservation</title>
</svelte:head>

<h1>Deposit from preservation</h1>
<TypeAhead
  db="dipstaging"
  on:typeahead.idselected={select}
  on:typeahead.iddeselected={clear} />
<p>
  {#if id}Selected id: {id}{:else}Select an id by typing it in above.{/if}
</p>
