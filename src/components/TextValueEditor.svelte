<script>
  export let data = {},
    mandatory = false,
    textarea = false;

  let label;
  let labelPresent = false;

  //Updates data object with new entires
  function input(inputField, Value, keyValue, i) {
    if (inputField == "language" && (Value != null || Value != "")) {
      if (Value in data) {
        labelPresent = true;
        data = data;
      } else {
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
  //TO clear and reset entry
  function clearEntry(label) {
    if (label != undefined) {
      if (!(label in data) && label.length < 2) {
        labelPresent = false;
      }
    }
  }

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
        <label for="language">{textValue}</label>
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
      {#if (Object.keys(data).length > 1 && mandatory) || textarea}
        <td>
          <a href on:click|preventDefault={removeRecord(i)}>Remove Entry</a>
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
        onchange={clearEntry(label)} />

    </td>
    <td>
      {#if labelPresent && label in data}
        <p class="exist">Language Exist</p>
      {:else if !labelPresent}
        <a
          href
          class="addnew"
          on:click|preventDefault={input('language', label, '', '')}>
          Add New Language
        </a>
      {/if}
    </td>

  </tr>
</table>
