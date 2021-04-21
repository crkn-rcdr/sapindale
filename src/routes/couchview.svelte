<script context="module">
  export async function preload(page, session) {
    const response = await this.fetch(`/couchview.json`);
    const reporesponse = await response.json();
    console.log("+_+_+REPOresponse", reporesponse);
    if (response.status === 200) {
      return {
        reporesponse
      };
    } else {
      this.error(response.status, reporesponse.error);
    }
  }
</script>

<script>
  import CouchView from "../components/Couch/View.svelte";
</script>

<svelte:head>
  <title>Sapindale — Couch view output</title>
</svelte:head>

<CouchView />
