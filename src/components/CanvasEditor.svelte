<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { state as authState } from "../auth.js";
  import { testManifest } from "../couch.js";
  const dispatch = createEventDispatcher();
  let manifest = {};
  let selected;

  onMount(async () => {
    manifest = testManifest(10);
    selected = manifest.items[0];
  });
</script>

<style>
  .thumbList {
    display: flex;
    margin-top: 1em;
    width: 100%;
    overflow-x: scroll;
  }
  .thumbList * + * {
    margin-left: 1em;
  }
</style>

{#if selected}
  <img src={selected.full} alt={selected.label} />
{/if}
{#if manifest.items}
  <div class="thumbList">
    {#each manifest.items as item}
      <img src={item.thumbnail} alt={`thumbnail for image: ${item.label}`} />
    {/each}
  </div>
{/if}
