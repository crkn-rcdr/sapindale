<script>
  import FaBackspace from "svelte-icons/fa/FaBackspace.svelte";
  import { testCollectionCall } from "../couch.js";
  import { state as authState } from "../auth.js";

  let value = "";
  let valueDe,
    valueLang = "";
  let rowcount;
  let labelinColl = [];

  let id, db;

  let token = $authState.token;

  async function collection() {
    rowcount = await testCollectionCall(token, db, id);

    labelinColl = rowcount.label;
  }
  function clearText(index) {
    console.log("Index: ", index);
    console.log("Clear value: ", labelinColl[index]);
  }
</script>

<style>
  table,
  th,
  tr,
  td {
    border: none;
  }
  .icon {
    color: red;
    width: 50px;
    height: 50px;
  }
</style>

<h2>Edit Label</h2>
<label for="collectionid">Type in the Collection ID:</label>
<input type="text" bind:value={id} on:blur={collection} />
<table>
  <tr>
    <th>Language</th>
    <th>Value</th>
  </tr>
  {#if labelinColl != null}
    {#each Object.keys(labelinColl) as label, index}
      <tr>
        <td>{label}</td>
        <td>
          <input type="text" bind:value={labelinColl[label]} />
        </td>
        <td class="icon" on:click={clearText(index)}>
          <FaBackspace />
        </td>
      </tr>
    {/each}
    <tr>
      <td>
        <input
          type="text"
          placeholder="Add New Language"
          bind:value={valueLang} />
      </td>
      <td>
        <input
          type="text"
          placeholder="Add New Text Value"
          bind:value={valueDe} />
      </td>
    </tr>
  {/if}
</table>
<button class="add">Add Label</button>
