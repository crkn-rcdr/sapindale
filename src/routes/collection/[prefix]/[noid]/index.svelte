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
  
  // the key directive below, newly added to Svelte, causes the CollectionEditor
  // component to reload when id changes, which is important because Sapper
  // doesn't do that for you if you're staying on the same route
</script>

<svelte:head>
  <title>Canadiana Platform Administration — Editing {collection.slug}</title>
</svelte:head>

{#key id}
<CollectionEditor {id} {collection} {parents} />
{/key}
