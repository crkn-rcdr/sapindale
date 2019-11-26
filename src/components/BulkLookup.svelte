<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { state as authState } from "../auth.js";
  import { idLookup } from "../couch.js";

  const dispatch = createEventDispatcher();
  let token = $authState.token;
  let idList;
  let prefix = "";
  export let id, db;
  export let hasPrefix = false;
  export let label = "Please provide a label for this Component";

  async function lookup(event) {
    let results = [];
    try {
      results = await idLookup(
        token,
        db,
        idList.split("\n").map(id => prefix + id)
      );
    } catch (ignore) {}
    console.log(results);
    dispatch("submit", { results });
  }
</script>

{#if hasPrefix}
  <label for={id + 'prefix'}>Prefix</label>
  <input type="text" id={id + 'prefix'} bind:value={prefix} />
  <br />
{/if}
<label for={id}>{label}</label>
<textarea class="border" {id} bind:value={idList} />
<br />
<button type="submit" on:click={lookup}>Submit</button>
