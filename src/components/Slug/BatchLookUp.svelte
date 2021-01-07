<script>
  import { getContext, createEventDispatcher } from "svelte";
  /* export let message; */
  export let onOkay = () => {};
  const { close } = getContext("simple-modal");
  const dispatch = createEventDispatcher();
  let prefix = "";
  let slugList = [];
  export let resultList = [];
  let type = "collection";
  let cancel = () => {
    close();
  };
  async function viewId() {
    prefix.replace(/["]/g, "");
    var slugToFind = prefix.split(/[,|\s]/);

    for (var index in slugToFind) {
      slugList.push(slugToFind[index]);
    }

    await lookupId();
  }
  async function lookupId(event) {
    for (var result in slugList) {
      //Fetch call To Be: written in Slug to get items in batch
      let response = await fetch(
        `/${type}/slug/search/${slugList[result]}.json`,
        {
          method: "POST",
          credentials: "same-origin"
        }
      );

      let json = await response.json();
      if (response.status === 200) {
        resultList = json;
      } else {
        error = json.error;
      }
    }

    onOkay(resultList);

    close();
  }
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

<textarea bind:value={prefix} />
<div class="buttons">
  <button on:click={cancel}>Cancel</button>
  <button on:click={viewId}>Lookup</button>
</div>
