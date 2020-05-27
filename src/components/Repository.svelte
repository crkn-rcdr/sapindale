<script>
  import { repositoryfilesize } from "../couch/repository.js";
  import { onMount } from "svelte";
  import { state as authState } from "../auth.js";

  var filesize = require("filesize");

  let token = $authState.token;

  export let repostats = undefined;

  onMount(async () => {
    var reposize = undefined;
    try {
      var reposize = await repositoryfilesize(token, {
        group_level: 1
      });
    } catch (ignore) {}

    if (Array.isArray(reposize)) {
      var sizetemp = {};
      reposize.forEach(function(arepo) {
        sizetemp[arepo.key[0]] = arepo.value;
      });
      repostats = sizetemp;
    }
  });
</script>

{#if repostats}

  <table>
    <tr>
      <th>Repository</th>
      <th>AIP count</th>
      <th>Total size</th>
    </tr>

    {#each Object.keys(repostats) as repository}
      <tr>
        <td>{repository}</td>
        <td>{repostats[repository].count}</td>
        <td>{repostats[repository].sum} ({filesize(repostats[repository].sum)})</td>
      </tr>
    {/each}

  </table>
{:else}Loading...{/if}
