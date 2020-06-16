<script>
  import SlugResolver from "../components/SlugResolver.svelte";
  import SlugTypeAhead from "../components/SlugTypeAhead.svelte";
  let id;
  let prefix, displayValue, displayType;
  function search(event) {
    id = event.detail.value;
  }
  function clear() {
    id = undefined;
  }
  function searchedPrefix(event) {
    prefix = event.detail.prefix;
  }
  function displayUrl(event) {
    displayValue = event.detail.noidValue;
    displayType = event.detail.noidType;
    console.log("values", displayType, displayValue);
  }
</script>

<h1>Slug Resolver</h1>
<div>
  <p>
    {#if id}Searched slug id: {id}{:else}Search a slug id by typing it.{/if}
  </p>
  <SlugResolver
    on:searched={search}
    on:deselected={clear}
    on:selected={displayUrl} />
</div>
<div>
  <SlugTypeAhead
    label="Type in the slug for Lookup"
    on:selected={searchedPrefix} />
  <p>
    {#if prefix}Typed slug: {prefix}{:else}Enter a slug by typing it.{/if}
  </p>
</div>
<div>
  {#if displayType === 'manifest'}
    <a href="/">Manifest</a>
  {:else if displayType === 'collection'}
    <a href="/collection/{displayValue}">Collection</a>
  {/if}
</div>
