<script>
  export let data = {},
    mandatory = false,
    textarea = false;

  let pairs = [];
  let label;
  let labelPresent = false;

  //Updates data object with new entires
  function input(inputField, Value, keyValue, i) {
    if (inputField == "language" && (Value != null || value != "")) {
      if (Value in data) {
        labelPresent = true;
      } else {
        labelPresent = false;
        data[Value] = data[Object.keys(data)[i]];
        delete data[Object.keys(data)[i]];
        data = data;
      }
    } else if (inputField == "langValue") {
      if (Value != null || value != "") {
        data[keyValue] = Value;
        data = data;
      }
    }
  }
  //TO add new record
  /*  function addRow(e) {
    data[""] = "";
  } */
  // TO clear the row
  async function removeRecord(i) {
    delete data[Object.keys(data)[i]];
    data = data;
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
  .exist {
    color: red;
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
        <!--  {#if data[textValue] == '' || data[textValue] == null || data[textValue] == undefined}
          <input
            type="text"
            name="language"
            class="languageInput"
            minlength="2"
            maxlength="4"
            bind:value={label}
            on:blur={input('language', label, '', i)} />
        {:else} -->
        <label for="language">{textValue}</label>
        <!--   {/if} -->
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
      {#if Object.keys(data).length > 1 && mandatory}
        <td>
          <a href on:click|preventDefault={removeRecord(i)}>Remove Record</a>
        </td>
      {/if}
    </tr>
  {/each}
  <tr>
    <td>

      <input
        type="text"
        name="language"
        class="languageInput"
        minlength="2"
        maxlength="4"
        bind:value={label}
        on:blur={input('language', label, '', '')} />

    </td>
    <td>
      {#if labelPresent}
        <p class="exist">
          Language Exist, enter a new language or Edit the existing value
        </p>
      {:else}
        <p>Enter New Language</p>
      {/if}
    </td>

  </tr>
  <!--  <tr class="addnew">
    <td>
      <a href class="add" on:click|preventDefault={addRow}>Add new language</a>
    </td>
    <td>
      <a href class="add" on:click|preventDefault={addRow}>Add new Record</a>
    </td>
  </tr> -->
</table>
