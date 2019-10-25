<script>
  import TypeAhead, { value } from "../components/TypeAhead.svelte";
  let id;
  function select(event) {
    id = event.detail.value;
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
  mode="documents"
  db="dipstaging"
  label="Input an AIP ID:"
  on:selected={select}
  on:deselected={clear} />
<p>
  {#if id}Selected id: {id}{:else}Select an id by typing it in above.{/if}
</p>
