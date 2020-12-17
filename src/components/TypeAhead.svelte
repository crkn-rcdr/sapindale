<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { stores } from "@sapper/app";
  import { documents } from "../couch";
  const dispatch = createEventDispatcher();

  const { session } = stores();
  let token = $session.token;
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
  function resetItem() {
    if (value == null || value === "") {
      value = datalist[0];
    }
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
  on:change={selectItem}
  on:blur={resetItem} />
<datalist id={`${id}.datalist`}>
  {#each datalist as item}
    <option>{item}</option>
  {/each}
</datalist>
