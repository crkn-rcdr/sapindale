<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let id;

  function selectId() {
    dispatch("typeahead.idselected", { id });
  }
</script>

<style>
  li {
    cursor: pointer;
    border: 1px solid black;
  }
</style>

<li class="highlight" on:click={selectId}>{id}</li>
