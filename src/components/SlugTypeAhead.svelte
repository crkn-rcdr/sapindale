<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { state as authState } from "../auth.js";
  import { search as searchSlug } from "../api/slug.js";

  const dispatch = createEventDispatcher();

  let prefix = "";
  let lookupList = [];
  let token = $authState.token;

  export let label = "Please provide a label for this component.";
  /*  onMount(async () => {
    await lookupSlug();
  }); */
  async function lookupSlug() {
    try {
      lookupList = await searchSlug(token, prefix);
    } catch (ignore) {}
  }
  async function selectItem(event) {
    dispatch("selected", { prefix });
  }
</script>

<style>
  label {
    padding-top: 4%;
    display: block;
    width: 150px;
    text-align: left;
  }
</style>

<label for={`${prefix}.input`}>{label}</label>
<input
  type="text"
  id="{prefix}.input"
  class="data-list border"
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
