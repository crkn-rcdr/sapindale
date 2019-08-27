<script>
  import CouchView from "../components/CouchView.svelte";
  import kval from "../components/CouchView.svelte";
  $: viewContents = { viewContents };

  let options = {
    reduce: false,
    startkey: "[1812,0]",
    endkey: "[1812,20]"
  };
</script>

<svelte:head>
  <title>Collection</title>
</svelte:head>

<h1>Couch Collections</h1>
<table>
  <tr />
  {#each viewContents as data}
    <tr>
      <td>{data.key}</td>
      <td>{data.value}</td>
    </tr>
  {/each}
</table>
<CouchView
  let:
  viewContents
  dbname="copresentation"
  ddoc="tdr"
  viewname="coltitles"
  {options} />
