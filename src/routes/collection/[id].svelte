<script context="module">
  import { getCollection } from "../../api/collection.js";
  export async function preload(page, session) {
    const { id } = page.params;
    const { token, authenticated } = session;
    if (authenticated) {
      const collection = await getCollection(token, encodeURIComponent(id));

      return {
        id,
        collection
      };
    }
  }
</script>

<script>
  import CollectionEditor from "../../components/CollectionEditor.svelte";

  export let id, collection;
  id = encodeURIComponent(id);
</script>

<svelte:head>
  <title>Sapindale — Collection Editor</title>
</svelte:head>

<CollectionEditor {id} {collection} />
