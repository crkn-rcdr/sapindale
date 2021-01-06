<script>
  import { getContext } from "svelte";
  export let message;
  export let onOkay = () => {};
  const { close } = getContext("simple-modal");
  let value = [];
  let cancel = () => {
    close();
  };
  let lookupId = () => {
    onOkay(value);
    close();
    //Fetch call To Be: written in Slug to get items in batch
  };
</script>

<style>
  textarea {
    font-size: 2rem;
    text-align: center;
  }
  .buttons {
    display: flex;
    justify-content: space-between;
  }
</style>

<textarea>{message}</textarea>
<div class="buttons">
  <button on:click={cancel}>Cancel</button>
  <button on:click={lookupId}>Lookup</button>
</div>
