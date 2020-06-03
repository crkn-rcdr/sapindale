<script>
  import SlugResolver from "../components/SlugResolver.svelte";
  import SlugTypeAhead from "../components/SlugTypeAhead.svelte";
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
    {#if id}Searched slug id: {id}{:else}Search a slug id by typing it.{/if}
  </p>
  <SlugResolver on:searched={search} on:deselected={clear} />
</div>
<div>
  <SlugTypeAhead label="Type in the slug for Lookup" />
</div>
