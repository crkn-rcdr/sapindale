<script>
  import { state as authState } from "../auth.js";
  import { onMount, createEventDispatcher } from "svelte";
  import SlugResolver from "../components/SlugResolver.svelte";
  import { collectionrequest as request } from "../api/collection.js";

  export let id = undefined;
  let token = $authState.token;
  let rowcount = [];
  
  async function getCollectionRecords({ id }) {
    rowcount = await request(token, id);
    console.log("test", rowcount);
  }
</script>

<input type="text" bind:value={id} />
<button on:click={getCollectionRecords({ id })}>Display Records</button>
<table>
  <thead>
    <tr>
      <th>Collection Records for: {rowcount.id}</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      {#each Object.keys(rowcount) as item}
        <th>{item}</th>
      {/each}
    </tr>
    <tr>
      {#each Object.keys(rowcount) as item}
        {#if typeof rowcount[item] == 'object'}
          <td>
            {#each Object.keys(rowcount[item]) as element}
              {rowcount[item][element]}
            {/each}
          </td>
        {:else}
          <td>{rowcount[item]}</td>
        {/if}
      {/each}
    </tr>
  </tbody>
</table>
<div class="ordered">
  <input type="checkbox" />
  <p>Ordered?</p>

  <div class="buttons">
    <button id="save">Save</button>
    <button id="publish">Save & Publish</button>
  </div>

</div>
