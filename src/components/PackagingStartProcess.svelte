<script>
  import { onMount } from "svelte";
  import { packagingfilesystem } from "../couch.js";
  import { state as authState } from "../auth.js";

  export let filesystem = undefined,
    confstage = undefined,
    what = "d";

  let token = $authState.token;

  onMount(async () => {
    try {
      filesystem = await packagingfilesystem(token, { group_level: 2 });
    } catch (ignore) {
      filesystem = undefined;
      return;
    }
  });

  async function viewConfstage(key = []) {
    console.log(key);
    try {
      // I haven't yet found a better way to copy the array...
      var endkey = JSON.parse(JSON.stringify(key));
      endkey.push({});
      confstage = await packagingfilesystem(token, {
        reduce: false,
        startkey: JSON.stringify(key),
        endkey: JSON.stringify(endkey),
             include_docs: what === "d"
      });
    } catch (ignore) {
      confstage = undefined;
      return;
    }

    console.log(key, confstage);
  }
</script>

{#if Array.isArray(filesystem)}
  <table border="1" id="typeTable">
    <tr>
      <th>Config ID</th>
      <th>Stage</th>
      <th>Identifier count</th>
    </tr>
    {#each filesystem as confstage}
      <tr>
        <td>{confstage.key[0]}</td>
        <td>{confstage.key[1]}</td>
        <td>
          <button
            on:click={() => {
              viewConfstage(confstage.key);
            }}>
            {confstage.value}
          </button>
        </td>
      </tr>
    {/each}
  </table>
  <select bind:value={what}>
    <option value="d">display directory details</option>
    <option value="l">display list</option>
  </select>
{:else}Loading Packaging filesystem information{/if}

{#if Array.isArray(confstage)}
{#if what==='l'}
<pre>
    {#each confstage as dir}
      {dir.id}
    {/each}
</pre>
{:else}
<dl>
                   {#each confstage as dir}
      <dt>{dir.id}
    {/each}
</dl>

{/if}
{/if}
