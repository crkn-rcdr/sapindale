<script context="module">
  export async function preload(page, session) {
    const id = `${page.params.prefix}/${page.params.noid}`;
    const response = await this.fetch(`/collection/${id}.json`);
    const collection = await response.json();
    if (response.status === 200) {
      const parentsResponse = await this.fetch(
        `/collection/${id}/parents.json`
      );
      const parents = await parentsResponse.json();

      return {
        id,
        collection,
        parents
      };
    } else {
      this.error(response.status, collection.error);
    }
  }
</script>

<script>
  import CollectionEditor from "../../../../components/Collection/Editor.svelte";

  export let id, collection, parents;
</script>

<svelte:head>
  <title>Sapindale — Collection Editor</title>
</svelte:head>

<CollectionEditor {id} {collection} {parents} />
