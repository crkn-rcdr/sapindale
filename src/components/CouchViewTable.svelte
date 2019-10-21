<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let data;

  function selectKey() {
    dispatch("message", {
      text: data.key
    });
  }
</script>

<style>
  td {
    align-self: auto;
    border: 1px solid brown;
  }
</style>

<tr>
  <td id="tdata" on:click={selectKey}>{data.key}</td>
  <td>{data.value}</td>
</tr>
