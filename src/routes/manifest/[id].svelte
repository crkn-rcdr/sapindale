<script context="module">
  export async function preload(page) {
    const { id } = page.params;

    return { id };
  }
</script>

<script>
  import ManifestView from "../../components/ManifestView.svelte";
  import SortableList from "../../components/SortableList.svelte";
  import CanvasEditor from "../../components/CanvasEditor.svelte";
  import { testManifest } from "../../couch.js";

  export let id;
  let manifest = testManifest(10);
  $: m = JSON.stringify(manifest, null, 2);

  let update = _ev => {
    // triggers a reactive update of the manifest
    manifest = manifest;
  };
  let changeLabel = changeText => {
    {
      let changedLabel = manifest.label;
      return changedLabel;
    }
  };
</script>

<style>

</style>

<svelte:head>
  <title>Sapindale — Manifest Editor</title>
</svelte:head>

<h1>Editing manifest: {id}</h1>
<label for="manifestEdit">Edit Manifest Label</label>
<input
  id="manifestEdit"
  type="text"
  bind:value={manifest.label}
  on:Input={changeLabel} />
<CanvasEditor items={manifest.items} on:manifestUpdate={update} />
<pre>{m}</pre>
