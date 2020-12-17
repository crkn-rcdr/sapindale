<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { stores } from "@sapper/app";
  import { idLookup } from "../couch";

  const dispatch = createEventDispatcher();
  const { session } = stores();
  let token = $session.token;
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

<style>
  label {
    display: inline-block;
    width: 140px;
    text-align: left;
  }
</style>

{#if hasPrefix}
  <label for={id + 'prefix'}>Prefix</label>
  <input type="text" id={id + 'prefix'} bind:value={prefix} />
  <br />
{/if}
<label for={id}>{label}</label>
<textarea class="border" {id} bind:value={idList} />
<br />
<button type="submit" on:click={lookup}>Submit</button>
