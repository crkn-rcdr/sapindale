<script context="module">
  export async function preload(page) {
    const { id } = page.params;

    return { id };
  }
</script>

<script>
  import CanvasEditor from "../../components/CanvasEditor.svelte";
  import { testManifest } from "../../couch.js";
  import { testCantaloupe } from "../../couch.js";

  export let id;
  let manifestData = testCantaloupe(id);
  let manifest = testManifest(10);
  $: m = JSON.stringify(manifest, null, 2);

  let update = _ev => {
    // triggers a reactive update of the manifest
    manifest = manifest;
  };
</script>

<svelte:head>
  <title>Sapindale — Manifest Editor</title>
</svelte:head>

<h1>Editing manifest: {id}</h1>
<label for="manifestEdit">Edit manifest label</label>
<input id="manifestEdit" type="text" bind:value={manifest.label} />
<CanvasEditor items={manifest.items} on:manifestUpdate={update} />
<pre>{m}</pre>
