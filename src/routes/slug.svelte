<script>
  import SlugTypeAhead from "../components/SlugTypeAhead.svelte";
  let slug;
  let mode = "manifest";

  function selected(event) {
    slug = event.detail;
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

<h1>Slug Lookup</h1>

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
        <a href="/{mode}/{encodeURIComponent(slug.noid)}">Click here to edit</a>
      {:else}Something went wrong. {slug.message}{/if}
    {:else}Enter a slug by typing it.{/if}
  </p>
</div>
