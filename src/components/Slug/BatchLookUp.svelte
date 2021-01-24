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
  /* let slug; */
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

      /*  let response = await type.map(types =>
        fetch(`/${types}/slug/search/${slugList[result]}.json`, {
          method: "POST",
          credentials: "same-origin"
        })
      );
      const responses = await Promise.all(response);
      let json = await responses.map(res => res.json());
      console.log("JSON", json);

      let inforesponse = type.map(types =>
        fetch(`/${types}/slug/${slugList[result]}.json`, {
          credentials: "same-origin"
        })
      );

      const slugResponse = await Promise.all(inforesponse);
      let slug = await slugResponse.map(res => res.json());
      console.log("slug", slug); */
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
      console.log("slug value", slug);

      const display = Object.values(slug);
      console.log("slug ", display);
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
