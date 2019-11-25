<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { state as authState } from "../auth.js";
  import { bulkId } from "../couch.js";

  const dispatch = createEventDispatcher();
  let token = $authState.token;
  let metaIdList;
  let metaList = [];
  export let id, db;
  export let label = "Please provide a label for this Component";

  async function bulkIdLookup(event) {
    try {
      metaList = await bulkId(token, db, metaIdList);
    } catch (ignore) {}
    dispatch("submit", { metaList });
  }
</script>

<div>
  <label for={id}>{label}</label>
  <textarea class="border" {id} bind:value={metaIdList} />
</div>
<div>
  <button type="submit" on:click={bulkIdLookup}>Submit</button>
</div>
