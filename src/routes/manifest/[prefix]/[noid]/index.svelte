<script context="module">
  export async function preload(page, session) {
    const id = `${page.params.prefix}/${page.params.noid}`;
    const response = await this.fetch(`/manifest/${id}.json`);
    const manifest = await response.json();
    if (response.status === 200) {
      const parentsResponse = await this.fetch(
        `/collection/${id}/parents.json`
      );
      const parents = await parentsResponse.json();

      return {
        id,
        manifest,
        parents
      };
    } else {
      this.error(response.status, manifest.error);
    }
  }
</script>

<script>
  import ManifestEditor from "../../../../components/Manifest/Editor.svelte";

  export let id, manifest, parents;
</script>

<svelte:head>
  <title>Canadiana Platform Administration — Editing {manifest.slug}</title>
</svelte:head>

<ManifestEditor {id} {manifest} {parents} />
