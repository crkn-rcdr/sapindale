<script>
  import SlugResolver from "../Slug/Resolver";
  import TextEditor from "../IIIF/TextEditor";
  import TextDisplay from "../IIIF/TextDisplay";
  import ParentsList from "../Collection/ParentsList";

  import { onMount } from "svelte";
  // TODO: handle type="pdf", somehow
  export let id = undefined;

  export let manifest = {
    id,
    slug: "",
    label: {},
    type: "multicanvas",
    canvases: [],
  };

  export let parents = [];

  let currentSlug = manifest.slug;
  let slugAvailable = true;
</script>

<style>
  .columns {
    display: flex;
  }
  .columns > * {
    flex: 0 1 100%;
  }
  .columns > *:not(:first-child) {
    margin-left: 2rem;
  }
</style>

<h1>Editing {manifest.slug || 'a new manifest'}</h1>

<div class="columns">
  <div>
    {#key manifest.slug}
      <SlugResolver
        inputLabel="Slug:"
        bind:value={currentSlug}
        bind:sameSlug={manifest.slug}
        bind:available={slugAvailable} />
    {/key}
    <!-- TODO: add type select here -->
    <div>
      <label for="TextLabel">Label:</label>
      <TextEditor
        bind:data={manifest.label}
        mandatory={true}
        textarea={false} />
    </div>

    <ParentsList {parents} />
  </div>

  <div>
    <h2>Canvases</h2>
  </div>
</div>
