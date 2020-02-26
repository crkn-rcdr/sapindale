<script context="module">
  export async function preload(page) {
    const { id } = page.params;

    return { id };
  }
</script>

<script>
  import CanvasEditor from "../../components/CanvasEditor.svelte";
  import { testCantaloupe } from "../../couch.js";
  import { state as authState } from "../../auth.js";

  export let id;
  let token = $authState.cantaloupeToken;
  let manifestData = testCantaloupe(id, token);
    $: m = JSON.stringify(manifestData, null, 2);

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
<input id="manifestEdit" type="text" bind:value={manifestData.label} />
<CanvasEditor items={manifestData.items} on:manifestUpdate={update} />

<pre>{m}</pre>
