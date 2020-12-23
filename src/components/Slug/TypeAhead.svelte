<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let type = "manifest";
  export let restrictType = false;
  if (!type) restrictType = false;
  export let label = "Please provide a label for this component.";

  let prefix = "";
  let lookupList = [];
  let error = "";

  async function lookupSlug() {
    let response = await fetch(`/${type}/slug/search/${prefix}.json`, {
      method: "POST",
      credentials: "same-origin"
    });
    let json = await response.json();
    if (response.status === 200) {
      lookupList = json;
    } else {
      error = json.error;
    }
  }

  async function selectItem(event) {
    if (lookupList && lookupList.includes(prefix)) {
      let response = await fetch(`/${type}/slug/${prefix}.json`, {
        credentials: "same-origin"
      });
      let slug = await response.json();
      if (response.status === 200) {
        dispatch("selected", slug);
      } else {
        error = slug.error;
      }
    }
  }
</script>

{#if !restrictType}
  <div class="typeSelect">
    <input
      type="radio"
      id="manifestRadio"
      bind:group={type}
      on:change={lookupSlug}
      value="manifest" />
    <label for="manifestRadio">Manifest</label>

    <input
      type="radio"
      id="collectionRadio"
      bind:group={type}
      on:change={lookupSlug}
      value="collection" />
    <label for="collectionRadio">Collection</label>
  </div>
{/if}

<label for="slugInput">{label}</label>
<input
  type="text"
  id="slugInput"
  list="slugList"
  bind:value={prefix}
  on:input={lookupSlug}
  on:change={selectItem} />

<datalist id="slugList">
  {#if lookupList}
    {#each lookupList as item}
      <option>{item}</option>
    {/each}
  {/if}
</datalist>

{#if error}
  <p class="danger">{error}</p>
{/if}
