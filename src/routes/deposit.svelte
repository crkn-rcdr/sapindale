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
<div class="container mx-auto">
  <h1>Deposit from preservation</h1>
  <div class="layout">
    <TypeAhead
      db="dipstaging"
      id="aip"
      label="Input an AIP ID:"
      on:selected={select}
      on:deselected={clear} />
  </div>
  <p class="layout">
    {#if id}Selected id: {id}{:else}Select an id by typing it in above.{/if}
  </p>
</div>
