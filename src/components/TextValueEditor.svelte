<script>
  import FaBackspace from "svelte-icons/fa/FaBackspace.svelte";
  import { state as authState } from "../auth.js";

  let value = "";
  let valueDe,
    valueLang = "";
  let rowcount;

  async function clearText(index) {
    valueDe = "";
    /* This will be taken when Update function is written */
    /* let testUpdate = await Object.values(labelinColl)[index]; */
  }
</script>

<style>
  .icon {
    color: red;
    width: 50px;
    height: 50px;
    font-size: small;
  }
  /* .add {
    line-height: 1%;
    font-size: small;
  } */
</style>

<table>
  <tr>
    <th>Language</th>
    <th>Value</th>
  </tr>
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
    <td class="icon" on:click|preventDefault={clearText}>Clear Text</td>
    <!--  <td>
      <button class="add">Add</button>
    </td> -->
  </tr>
</table>
