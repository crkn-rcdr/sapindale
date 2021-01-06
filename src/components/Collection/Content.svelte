<script>
  import { getContext } from "svelte";
  import { fly } from "svelte/transition";
  import BatchLookUp from "../Slug/BatchLookUp.svelte";
  const { open } = getContext("simple-modal");

  let opening = false;
  let opened = false;
  let closing = false;
  let closed = false;

  const openDialog = () => {
    open(BatchLookUp, { message: "Paste the Items to add" });
  };
</script>

<style>
  section {
    padding-top: 0.5em;
  }

  #state {
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0.33;
    font-size: 0.8em;
  }
</style>

<section>
  <button on:click={openDialog}>Add Item</button>
  <br />

  <div id="state">
    {#if opening}
      <p>opening modal...</p>
    {:else if opened}
      <p>opened modal!</p>
    {:else if closing}
      <p>closing modal...</p>
    {:else if closed}
      <p>closed modal!</p>
    {/if}
  </div>
</section>
