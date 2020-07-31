<script context="module">
  export async function preload(page) {
    const { id } = page.params;

    return { id };
  }
</script>

<script>
  import CanvasEditor from "../../components/CanvasEditor.svelte";
  /* import { state as authState } from "../../auth.js"; */
  import { stores } from "@sapper/app";

  export let id;
  let itemValue;
  let rList;
  /*  let ctoken = $authState.cantaloupeToken; */
  const { session } = stores();
  let token = $session.token;

  $: m = JSON.stringify(rList, null, 2);
  let manifest;
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
<div>
  <label for="manifestEdit" class="flex pr-2 text-xl text-center">
    Edit manifest label:
  </label>
  {#if itemValue}
    <input id="manifestEdit" type="text" bind:value={itemValue.label} />
  {/if}
</div>
{#if itemValue}
  <div>
    <CanvasEditor
      items={itemValue.items}
      on:manifestUpdate={update}
      on:reorderedList={reorderList} />
  </div>
{/if}
