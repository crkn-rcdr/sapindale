<script>
  export let reporesponse, repoManage;
</script>

<!-- <script context="module">
  export async function preload(page, session) {
    const repoManage = page.params.merged;
    const response = await this.fetch(`/repository/repository.json`);
    const reporesponse = await response.json();
    if (response.status === 200) {
      return {
        repoManage,
        reporesponse
      };
    } else {
      this.error(response.status, reporesponse.error);
    }
  }
</script> -->
<svelte:head>
  <title>Repository</title>
</svelte:head>
<p>{repoManage}{reporesponse}</p>
