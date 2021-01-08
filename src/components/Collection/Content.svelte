<script>
  import { getContext } from "svelte";
  import { fly } from "svelte/transition";
  import BatchLookUp from "../Slug/BatchLookUp.svelte";
  const { open } = getContext("simple-modal");

  let resultList = [];
  const onOkay = text => {
    resultList = text;
  };
  function openDialog(event) {
    open(BatchLookUp, { onOkay });
  }
</script>

<style>
  section {
    padding-top: 0.5em;
  }
</style>

<section>
  <button on:click={openDialog}>Add Item</button>
  <br />
  <p>{resultList}</p>

</section>
