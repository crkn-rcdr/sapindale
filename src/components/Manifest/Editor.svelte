<script>
  import SlugResolver from "../Slug/Resolver";
  import TextEditor from "../IIIF/TextEditor";
  import TextDisplay from "../IIIF/TextDisplay";
  import ParentsList from "../Collection/ParentsList";

  // TODO: handle type="pdf", somehow
  export let id = undefined;

  export let manifest = {
    id,
    slug: "",
    label: {},
    type: "multicanvas",
    canvases: []
  };

  export let parents = [];
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
    <div class="children-inline">
      <label for="Slug">Slug:</label>
      <input type="text" bind:value={manifest.slug} />
    </div>
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
