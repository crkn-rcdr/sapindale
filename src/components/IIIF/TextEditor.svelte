<script>
  export let data = {},
    mandatory = false,
    textarea = false;

  let newLanguage = "";
  $: newLanguageDisabled = newLanguage.length < 2 || newLanguage.length > 4;
  let newLanguageAlreadyExists = false;

  // Adds a new entry to data
  function addEntry() {
    if (!newLanguageDisabled) {
      if (Object.keys(data).includes(newLanguage)) {
        newLanguageAlreadyExists = true;
      } else {
        data[newLanguage] = "";
        newLanguage = "";
        data = data;
      }
    }
  }

  // Clears the warning that appears if a new language already exists
  function clearWarning() {
    if (newLanguageAlreadyExists) newLanguageAlreadyExists = false;
  }

  // Removes an entry
  function removeEntry(language) {
    delete data[language];
    data = data;
  }
</script>

<style>
  .languageInput {
    width: 4ch;
  }
</style>

<table>

  <tr>
    <th>Language</th>
    <th>Value</th>
  </tr>

  {#each Object.keys(data).sort() as language}
    <tr>
      <td>
        <b>{language}</b>
      </td>
      {#if textarea}
        <td>
          <textarea bind:value={data[language]} />
        </td>
      {:else}
        <td>
          <input type="text" bind:value={data[language]} />
        </td>
      {/if}
      {#if !(Object.keys(data).length < 2 && mandatory)}
        <td>
          <a href on:click|preventDefault={removeEntry(language)}>
            Remove entry
          </a>
        </td>
      {/if}
    </tr>
  {/each}
</table>
<form class="inline">
  <input
    type="text"
    class="languageInput"
    minlength="2"
    maxlength="4"
    bind:value={newLanguage}
    on:input={clearWarning} />
  <button
    type="submit"
    on:click|preventDefault={addEntry}
    disabled={newLanguageDisabled}>
    Add new language
  </button>
  {#if newLanguageAlreadyExists}
    <span class="danger">There is already an entry for this language.</span>
  {/if}
</form>
