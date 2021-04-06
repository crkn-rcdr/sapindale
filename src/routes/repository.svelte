<script context="module">
  export async function preload(page, session) {
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
    <th>AIP Count</th>
    <th>Total Disk Used</th>
    <th>Earliest Verified</th>
    <th>Latest Verified</th>
    <th>Difference</th>
    <th>Replication</th>
  </tr>
  {#each reporesponse as repository}
    <tr>
      <td>{repository.repo}</td>
      <td>{repository.aipCount}</td>
      <td>{repository.diskUsed}({filesize(repository.diskUsed)})</td>
      <td>{new Date(repository.earliest.toString())}</td>
      <td>{new Date(repository.latest.toString())}</td>
      <td>{repository.difference}</td>
      <td>{repository.replicate}</td>
    </tr>
  {/each}
</table>
