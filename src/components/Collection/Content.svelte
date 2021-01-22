<script>
  import { getContext } from "svelte";
  import { fly } from "svelte/transition";
  import BatchLookUp from "../Slug/BatchLookUp.svelte";
  import TextDisplay from "../IIIF/TextDisplay";
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
  {#each resultList as result}
    <p>{resultList.id}</p>
  {/each}
  <!--  {#each resultList as item}
    <TextDisplay data={item.label} />
  {/each} -->

</section>
