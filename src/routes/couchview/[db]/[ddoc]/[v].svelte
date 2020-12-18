<script context="module">
  import qs from "query-string";
  import {
    design_doc_views as getViews,
    view as fetchView
  } from "../../../../couch";
  export async function preload(page, session) {
    const { token, authenticated } = session;
    if (authenticated) {
      const { db, ddoc, v } = page.params;
      const view = `${ddoc}/${v}`;
      const options = page.query;
      options.reduce = options.reduce === "true";
      options.range = options.range === "true";

      const views = await getViews(token);
      return { db, view, options, views };
    }
  }
</script>

<script>
  import CouchView from "../../../../components/Couch/View.svelte";

  export let db, view, options, views;
</script>

<svelte:head>
  <title>Sapindale — Couch view output</title>
</svelte:head>

<CouchView {db} {view} {options} {views} />
