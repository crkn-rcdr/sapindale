<script>
  import { onMount, createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

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
    const response = await fetch("/typeahead.json", {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({
        db: db,
        value: value,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      let json = await response.json();
      if (json) {
        datalist = json;
      }
    }
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

<label for={`${id}.input`}>{label}</label>

<input
  type="text"
  id={`${id}.input`}
  class="data-list border"
  list={`${id}.datalist`}
  bind:value
  on:input={lookupIds}
  on:change={selectItem}
  on:blur={resetItem}
/>
<datalist id={`${id}.datalist`}>
  {#each datalist as item}
    <option>{item}</option>
  {/each}
</datalist>

<style>
  label {
    display: inline-block;
    width: 140px;
    text-align: left;
  }
</style>
