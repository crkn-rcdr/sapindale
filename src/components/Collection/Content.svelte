<script>
  import { getContext, createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import BatchLookUp from "../Slug/BatchLookUp.svelte";
  import TextDisplay from "../IIIF/TextDisplay";
  const { open } = getContext("simple-modal");
  const dispatch = createEventDispatcher();

  let resultList = [];
  const onOkay = (text, event) => {
    resultList = text;
    dispatch("message", resultList);
  };

  function openDialog(event) {
    open(BatchLookUp, { onOkay });
  }
</script>

<style>
  div {
    padding-top: 0.5em;
  }
</style>

<div>
  {#if resultList.length == 0}
    <button on:click={openDialog}>Add Items</button>
  {/if}
</div>
