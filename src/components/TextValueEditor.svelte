<script>
  import { beforeUpdate } from "svelte";
  export let data = {},
    mandatory = false,
    textarea = false,
    state = "VALID";

  let pairs = [];
  beforeUpdate(() => {
    if (data && state === "VALID") {
      pairs = Object.keys(data).map(key => {
        return { language: key, value: data[key] };
      });
      console.log(pairs);
    }
  });

  function input(event) {
    // TODO: determine if the resulting pairs list can create a valid data object
    // for the state to be valid, each language key needs to be unique, and no language key can be empty
    // if the state is valid, set state to "VALID" and update data with the current state
    // data = pairs.reduce((acc, pair) => { acc[pair.language] = pair.value; return acc }, {})
    // l = [1,2,3,4,5]; sum = l.reduce((acc, element) => {acc += element;}, 0)
  }

  function addRow(e) {
    /*  data[Object.keys(data)[e]] = ""; */
    data[Object.values(data)[e]] = "";
  }
  // TODO: this should actually clear the row
  async function clearText(i) {
    data[Object.keys(data)[i]] = "";
    data[Object.values(data)[i]] = "";
    delete data[Object.keys(data)[i]];
  }
</script>

<style>
  .languageInput {
    width: 4em;
  }
  .addnew {
    background-color: var(--color);
    text-align: center;
  }
  .addnew a {
    color: var(--color-bg);
  }
</style>

<table>

  <tr>
    <th>Language</th>
    <th>value</th>
  </tr>

  {#each pairs as pair, index (pair.language)}
    <tr>
      <td>
        <input
          type="text"
          class="languageInput"
          minlength="2"
          maxlength="4"
          bind:value={pair.language}
          on:input={input} />
      </td>
      {#if textarea}
        <td>
          <textarea bind:value={pair.value} on:input={input} />
        </td>
      {:else}
        <td>
          <input type="text" bind:value={pair.value} on:input={input} />
        </td>
      {/if}
      {#if !mandatory || pairs.length > 1}
        <td>
          <a href on:click|preventDefault={clearText(index)}>Clear Text</a>
        </td>
      {/if}
    </tr>
  {/each}
  <tr>
    <td class="addnew" colspan="3">
      <a href class="add" on:click|preventDefault={addRow}>Add new language</a>
    </td>
  </tr>
</table>
