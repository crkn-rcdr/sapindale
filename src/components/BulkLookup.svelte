<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { state as authState } from "../auth.js";
  import { bulkId } from "../couch.js";

  const dispatch = createEventDispatcher();
  let token = $authState.token;
  export let metaId = "";
  let metaIdList = metaId.split("\n");
  let contentarr = [];
  let content;
  let metaList = [];
  let contentcheck;
  export let id, db;
  export let label = "Please provide a label for this Component";

  async function bulkIdLookup(event) {
    try {
      metaList = await bulkId(token, db, metaIdList);
    } catch (ignore) {}
    dispatch("submit", { metaIdList });
  }
</script>

<div>
  <label for={`${metaId}`}>{label}</label>
  <textarea id={`${metaId}`} bind:value={metaIdList} />
  <button type="submit" on:click={bulkIdLookup}>Submit</button>
</div>
