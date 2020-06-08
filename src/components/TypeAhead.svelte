<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { state as authState } from "../auth.js";
  import { documents } from "../couch.js";
  const dispatch = createEventDispatcher();

  let token = $authState.token;
  let value = "";

  export let id, db;
  export let label = "Please provide a label for this component.";

  let datalist = [];

  onMount(async () => {
    await lookupIds();
    if (value === "") {
      value = datalist[0];
    }
  });

  async function lookupIds(event) {
    dispatch("deselected");
    try {
      datalist = (await documents(token, db, {
        startkey: JSON.stringify(value),
        endkey: JSON.stringify(`${value}\uFFEF`),
        limit: 12
      })).map(row => row.id);
    } catch (ignore) {}
  }

  function selectItem(event) {
    dispatch("selected", { value });
  }
</script>

<style>
  label {
    display: inline-block;
    width: 140px;
    text-align: left;
  }
</style>

<label for={`${id}.input`}>{label}</label>

<input
  type="text"
  id={`${id}.input`}
  class="data-list border"
  list={`${id}.datalist`}
  bind:value
  on:input={lookupIds}
  on:change={selectItem} />
<datalist id={`${id}.datalist`}>
  {#each datalist as item}
    <option>{item}</option>
  {/each}
</datalist>
