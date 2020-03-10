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
  let manifestdata = {};
  let itemValue;
  let rList;
  let ctoken = $authState.cantaloupeToken;
  let token = $authState.token;
  let manifestData = testCantaloupe(id, ctoken, token);
  Promise.resolve(manifestData).then(function(value) {
    itemValue = value;
  });

  $: m = JSON.stringify(rList, null, 2);

  let update = _ev => {
    // triggers a reactive update of the manifest
    manifest = manifest;
  };
  let reorderList = ev => {
    rList = ev.detail;
  };
</script>

<svelte:head>
  <title>Sapindale — Manifest Editor</title>
</svelte:head>

<h1>Editing manifest: {id}</h1>
<label for="manifestEdit">Edit manifest label</label>
{#if itemValue}
  <input id="manifestEdit" type="text" bind:value={itemValue.label} />
  <CanvasEditor
    items={itemValue.items}
    on:manifestUpdate={update}
    on:reorderedList={reorderList} />
{/if}
