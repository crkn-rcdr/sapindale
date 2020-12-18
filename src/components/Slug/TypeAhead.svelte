<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { stores } from "@sapper/app";
  import {
    resolveSlug as resolveCollectionSlug,
    searchSlug as searchCollectionSlug
  } from "../../api/collection";
  import {
    resolveSlug as resolveManifestSlug,
    searchSlug as searchManifestSlug
  } from "../../api/manifest";

  const dispatch = createEventDispatcher();
  export let type;
  export let restrictType = false;
  if (!type) restrictType = false;
  export let label = "Please provide a label for this component.";

  let prefix = "";
  let lookupList = [];
  let error = "";
  const { session } = stores();
  let token = $session.token;

  async function lookupSlug() {
    let searchMethod =
      type === "manifest" ? searchManifestSlug : searchCollectionSlug;
    try {
      lookupList = await searchMethod(token, prefix);
    } catch (e) {
      error = e.message;
    }
  }

  async function selectItem(event) {
    if (lookupList && lookupList.includes(prefix)) {
      let resolveMethod =
        type === "manifest" ? resolveManifestSlug : resolveCollectionSlug;
      try {
        let slug = await resolveMethod(token, prefix);
        dispatch("selected", slug);
      } catch (e) {
        error = e.message;
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
