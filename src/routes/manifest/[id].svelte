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
  import ManifestEditor from "../../components/Manifest/Editor.svelte";

  export let id, manifest;
  id = encodeURIComponent(id);
</script>

<svelte:head>
  <title>Sapindale — Manifest Editor</title>
</svelte:head>

<ManifestEditor {id} {manifest} />
