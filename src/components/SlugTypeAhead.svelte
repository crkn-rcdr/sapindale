<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { state as authState } from "../auth.js";
  import {
    resolveSlug as resolveCollectionSlug,
    searchSlug as searchCollectionSlug
  } from "../api/collection.js";
  import {
    resolveSlug as resolveManifestSlug,
    searchSlug as searchManifestSlug
  } from "../api/manifest.js";

  const dispatch = createEventDispatcher();
  export let mode;

  let prefix = "";
  let lookupList = [];
  let token = $authState.token;

  export let label = "Please provide a label for this component.";

  function clear() {
    lookupList = [];
    dispatch("deselected", {});
  }

  async function lookupSlug() {
    try {
      let searchMethod =
        mode === "manifest" ? searchManifestSlug : searchCollectionSlug;
      lookupList = await searchMethod(token, prefix);
    } catch (ignore) {}
  }
  async function selectItem(event) {
    let resolveMethod =
      mode === "manifest" ? resolveManifestSlug : resolveCollectionSlug;
    let slug = await resolveMethod(token, prefix);
    dispatch("selected", slug);
  }
</script>

<style>
  label {
    display: block;
    width: 150px;
    text-align: left;
  }

  input[type="text"],
  datalist {
    width: 500px;
  }
</style>

<label>
  <input type="radio" bind:group={mode} on:select={clear} value="manifest" />
  Manifest
</label>

<label>
  <input type="radio" bind:group={mode} on:select={clear} value="collection" />
  Collection
</label>

<label for={`${prefix}.input`}>{label}</label>
<input
  type="text"
  id="{prefix}.input"
  list={`${lookupList}.prefix`}
  bind:value={prefix}
  on:input={lookupSlug}
  on:change={selectItem} />

<datalist id={`${lookupList}.prefix`}>
  {#if lookupList != null}
    {#each lookupList as item}
      <option>{item}</option>
    {/each}
  {/if}
</datalist>
