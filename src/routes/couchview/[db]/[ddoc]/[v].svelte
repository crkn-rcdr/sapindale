<script context="module">
  import qs from "query-string";
  export async function preload(page) {
    const { db, ddoc, v } = page.params;
    const view = `${ddoc}/${v}`;
    const options = page.query;

    return { db, view, options };
  }
</script>

<script>
  import CouchView from "../../../../components/CouchView.svelte";

  export let db, view, options;
</script>

<style>

</style>

<svelte:head>
  <title>Sapindale — Couch view output</title>
</svelte:head>

<CouchView {db} {view} {options} />
