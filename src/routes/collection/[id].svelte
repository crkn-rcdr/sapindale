<script context="module">
  export async function preload(page) {
    const { id } = page.params;

    return { id };
  }
</script>

<script>
  import CollectionEditor from "../../components/CollectionEditor.svelte";
  import TextValueEditor from "../../components/TextValueEditor.svelte";
  export let id;
  id = encodeURIComponent(id);
  console.log("id", id);
</script>

<svelte:head>
  <title>Sapindale — Collection Editor</title>
</svelte:head>
<!-- <TextValueEditor /> -->
<CollectionEditor {id} />
