<script>
  import { getContext } from "svelte";
  import { depositors } from "../../depositor";
  /* export let message; */
  export let onOkay = () => {};
  const { close } = getContext("simple-modal");

  let depositor = "";
  let prefix = "";
  let slugList = [];
  let resultList = [];
  let slug;
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
      //Fetch call To Be: written in Slug to get items in batch

      let response = await type.map(types =>
        fetch(`/${types}/slug/search/${slugList[result]}.json`, {
          method: "POST",
          credentials: "same-origin"
        })
      );
      Promise.all(response).then(responses => {
        for (let response of responses) {
          if (response.status === 200) {
            resultList = response.json;
          } else {
            error = resultList.error;
          }
        }
      });

      let inforesponse = await type.map(types =>
        fetch(`/${types}/slug/${slugList[result]}.json`, {
          credentials: "same-origin"
        })
      );
      /*  let slug = await inforesponse.json(); */
      Promise.all(inforesponse).then(responses => {
        for (let inforesponse of responses) {
          if (inforesponse.status === 200) {
            slug = inforesponse.json();
          } else {
            error = slug.error;
          }
        }
      });

      onOkay(slug);
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

<select bind:value={depositor}>
  <option value="" />
  {#each depositors as selected}
    <option value={selected.id}>{selected.name}</option>
  {/each}
</select>
{#if depositor !== ''}({depositor}){/if}
<textarea bind:value={prefix} />
<div class="buttons">
  <button on:click={cancel}>Cancel</button>
  <button on:click={viewId}>Lookup</button>
</div>
