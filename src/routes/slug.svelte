<script>
  import SlugTypeAhead from "../components/SlugTypeAhead.svelte";
<<<<<<< HEAD
  let id;
  let prefix, displayValue, displayType;
  function search(event) {
    id = event.detail.value;
  }
  function clear() {
    id = undefined;
=======
  let slug;
  let mode = "manifest";

  function selected(event) {
    slug = event.detail;
>>>>>>> master
  }

  function clear(event) {
    slug = undefined;
  }
  function displayUrl(event) {
    displayValue = event.detail.noidValue;
    displayType = event.detail.noidType;
    console.log("values", displayType, displayValue);
  }
</script>

<<<<<<< HEAD
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
=======
<h1>Slug Lookup</h1>

>>>>>>> master
<div>
  <SlugTypeAhead
    bind:mode
    label="Enter a slug"
    on:selected={selected}
    on:deselected={clear} />
  <p>
    {#if slug}
      {#if slug.noid}
        You've found:
        <br />
        {Object.values(slug.label).join(' = ')} (Slug: {slug.id}) (NOID: {slug.noid})
        <br />
        <a href="/{mode}/{slug.noid.replace('/', '%2F')}">Click here to edit</a>
      {:else}Something went wrong. {slug.message}{/if}
    {:else}Enter a slug by typing it.{/if}
  </p>
</div>
<div>
  {#if displayType === 'manifest'}
    <a href="/">Manifest</a>
  {:else if displayType === 'collection'}
    <a href="/collection/{displayValue}">Collection</a>
  {/if}
</div>
