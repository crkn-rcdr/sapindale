<script context="module">
  export async function preload(page, session) {
    /*  const repoManage = page.params.merged; */
    const response = await this.fetch(`/repository.json`);
    const reporesponse = await response.json();
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
  import filesize from "filesize";
  export let reporesponse;
</script>

<svelte:head>
  <title>Repository</title>
</svelte:head>
<table>
  <tr>
    <th>Repository</th>
    {#each reporesponse as repository}
      <th>{repository.repo}</th>
    {/each}
  </tr>
  <tr>
    <th>AIP count</th>
    {#each reporesponse as repository}
      <td>{repository.aipCount}</td>
    {/each}
  </tr>
  <tr>
    <th>Total disk used</th>
    {#each reporesponse as repository}
      <td>{repository.diskUsed}({filesize(repository.diskUsed)})</td>
    {/each}
  </tr>
  <tr>
    <th>Earliest validated</th>
    {#each reporesponse as repository}
      <td>{repository.earliest}</td>
    {/each}
  </tr>
  <tr>
    <th>Latest validated</th>
    {#each reporesponse as repository}
      <td>{repository.latest}</td>
    {/each}
  </tr>
  <tr>
    <th>Differance (human readable)</th>
    {#each reporesponse as repository}
      <td>{repository.difference}</td>
    {/each}
  </tr>

  <tr>
    <th>Replication queue length</th>
    {#each Object.values(reporesponse) as repository}
      <td>
        {#if repository.replicate.content != null}
          {repository.replicate.content}
        {:else}{repository.replicate.message}{/if}
      </td>
    {/each}
  </tr>

</table>
