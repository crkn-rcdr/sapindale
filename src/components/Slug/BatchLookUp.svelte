<script>
  import { getContext } from "svelte";
  export let onOkay = () => {};
  const { close } = getContext("simple-modal");
  import PrefixSelector from "../util/PrefixSelector.svelte";

  let depositor = undefined;
  let prefix = "";
  let slugList = [];
  let arrResult = [];

  let error = "";
  let type = ["collection", "manifest"];
  let cancel = () => {
    close();
  };

  async function viewId() {
    var slugToFind = prefix.split(/[,|\s]/);

    for (var index in slugToFind) {
      if (depositor !== "" && slugToFind[index].indexOf(".") === -1) {
        var prefixedSlug = depositor + "." + slugToFind[index];
      } else if (depositor == "" && slugToFind[index].indexOf(".") === -1) {
        prefixedSlug = slugToFind[index];
      }
      slugList.push(prefixedSlug);
    }

    await lookupId();
  }
  async function lookupId(event) {
    for (var result in slugList) {
      const slug = await Promise.all(
        type.map(async types => {
          const response = await fetch(
            `/${types}/slug/${slugList[result]}.json`,
            {
              credentials: "same-origin"
            }
          );
          return await response.json();
        })
      );

      const display = Object.values(slug)
        .filter(sift => !sift.error)
        .map(key => key);
      arrResult.push(display[0]);

      onOkay(arrResult);
    }

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

<legend>
  <PrefixSelector bind:prefix={depositor} />
</legend>
{#if depositor !== ''}({depositor}){/if}
<textarea bind:value={prefix} />
<div class="buttons">
  <button on:click={cancel}>Cancel</button>
  <button on:click={viewId}>Lookup</button>
</div>
