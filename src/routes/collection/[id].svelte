<script context="module">
  export async function preload(page, session) {
    const { id } = page.params;
    const response = await this.fetch(`/collection/${id}.json`);

    if (response.status === 200) {
      const collection = await response.json();

      return {
        id,
        collection
      };
    } else {
      this.error(404, "Collection not found");
    }
  }
</script>

<script>
  import CollectionEditor from "../../components/Collection/Editor.svelte";

  export let id, collection;
  id = encodeURIComponent(id);
</script>

<svelte:head>
  <title>Sapindale — Collection Editor</title>
</svelte:head>

<CollectionEditor {id} {collection} />
