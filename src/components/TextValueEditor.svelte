<script>
  /* import { state as authState } from "../auth.js"; */
  import { createEventDispatcher } from "svelte";

  export let data = [{}],
    mandatory = false,
    textarea = false;
  let label;
  const dispatch = createEventDispatcher();

  function addRow(e) {
    /*  data[Object.keys(data)[e]] = ""; */
    data[Object.values(data)[e]] = "";
  }
  async function clearText(i) {
    data[Object.keys(data)[i]] = "";
    data[Object.values(data)[i]] = "";
    delete data[Object.keys(data)[i]];
  }
</script>

<table>

  <tr>
    <th>Language</th>
    <th>value</th>
  </tr>

  {#each Object.keys(data) as label, i (i)}
    <tr>
      <td>
        <input type="text" bind:value={label} />
      </td>
      {#if textarea === true}
        <td>
          <input type="textarea" bind:value={data[label]} />
        </td>
      {:else}
        <td>
          <input type="text" bind:value={data[label]} />
        </td>
      {/if}
      {#if Object.keys(data).length > 1}
        <td>
          <a href on:click|preventDefault={clearText(i)}>Clear Text</a>
        </td>
      {/if}
    </tr>
  {/each}

  <a href class="add" on:click|preventDefault={addRow}>Add New Record</a>
</table>
