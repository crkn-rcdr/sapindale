<script context="module">
  export async function preload(page, session) {
    const { id } = page.params;
    return { id };
  }
</script>

<script>
  import Dmd from "../../components/DMD.svelte";
  export let id;
</script>

<svelte:head>
  <title>Sapindale — Descriptive MetaData loader</title>
</svelte:head>

<Dmd {id} />
