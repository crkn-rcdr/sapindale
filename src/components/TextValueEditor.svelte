<script>
  import { beforeUpdate, afterUpdate, tick, onMount, onDestroy } from "svelte";
  export let data = {},
    mandatory = false,
    textarea = false,
    state = "VALID";
  let pairs = [];
  let label;

  //Updates data object with new entires
  function input(inputField, Value, keyValue, i) {
    if (inputField == "language" && (Value != null || value != "")) {
      data[Value] = data[Object.keys(data)[i]];
      delete data[Object.keys(data)[i]];
      data = data;
    } else if (inputField == "langValue") {
      if (Value != null || value != "") {
        data[keyValue] = Value;
        data = data;
      }
    }
  }
  //TO add new record
  function addRow(e) {
    data[""] = "";
  }
  // TO clear the row
  async function removeRecord(i) {
    if (Object.keys(data).length > 1) {
      delete data[Object.keys(data)[i]];
      data = data;
    } else {
      alert("You cannot delete the only record ");
    }
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

  {#each Object.keys(data) as textValue, i (i)}
    <tr>
      <td>
        {#if data[textValue] == '' || data[textValue] == null || data[textValue] == undefined}
          <input
            type="text"
            name="language"
            class="languageInput"
            minlength="2"
            maxlength="4"
            bind:value={label}
            on:blur={input('language', label, '', i)} />
        {:else}
          <label for="language">{textValue}</label>
        {/if}
      </td>
      {#if textarea}
        <td>
          <textarea
            name="langValue"
            bind:value={data[textValue]}
            on:blur={input('langValue', data[textValue], textValue, i)} />
        </td>
      {:else}
        <td>
          <input
            name="langValue"
            type="text"
            bind:value={data[textValue]}
            on:blur={input('langValue', data[textValue], textValue, i)} />
        </td>
      {/if}
      {#if !mandatory || data[textValue].length > 1}
        <td>
          <a href on:click|preventDefault={removeRecord(i)}>Remove Record</a>
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
