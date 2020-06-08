<script>
  import SlugResolver from "../components/SlugResolver.svelte";
  import SlugTypeAhead from "../components/SlugTypeAhead.svelte";
  let id;
  let prefix;
  function search(event) {
    id = event.detail.value;
  }
  function clear() {
    id = undefined;
  }
  function searchedPrefix(event) {
    prefix = event.detail.prefix;
  }
</script>

<h1>Slug Resolver</h1>
<div>
  <p>
    {#if id}Searched slug id: {id}{:else}Search a slug id by typing it.{/if}
  </p>
  <SlugResolver
    label="Search slug"
    value={id}
    on:searched={search}
    on:deselected={clear} />
</div>
<div>
  <SlugTypeAhead
    label="Type in the slug for Lookup"
    on:selected={searchedPrefix} />
  <p>
    {#if prefix}Typed slug: {prefix}{:else}Enter a slug by typing it.{/if}
  </p>
</div>
