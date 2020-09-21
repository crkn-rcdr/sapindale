<script context="module">
  import { getManifest } from "../../api/manifest.js";
  export async function preload(page, session) {
    const { id } = page.params;
    const { token, authenticated } = session;
    if (authenticated) {
      const manifest = await getManifest(token, encodeURIComponent(id));

      return {
        id,
        manifest
      };
    }
  }
</script>

<script>
  import ManifestEditor from "../../components/ManifestEditor.svelte";

  export let id, manifest;
  id = encodeURIComponent(id);
</script>

<!-- <script>
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
</script><svelte:head>
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
{/if} -->
<svelte:head>
  <title>Sapindale — Manifest Editor</title>
</svelte:head>

<ManifestEditor {id} {manifest} />
