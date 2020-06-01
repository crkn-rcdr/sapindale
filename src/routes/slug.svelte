<script>
  import SlugResolver from "../components/SlugResolver.svelte";

  let id;
  function search(event) {
    id = event.detail.value;
  }
  function clear() {
    id = undefined;
  }
</script>

<h1>Slug Resolver</h1>
<div>
  <p>
    {#if id}Searched slug id: {id}{:else}Search a slug id by typing it{/if}
  </p>
  <SlugResolver on:searched={search} on:deselected={clear} />
</div>
