<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { state as authState } from "../auth.js";
  import { testManifest } from "../couch.js";
  import SortableList from "../components/SortableList.svelte";

  const dispatch = createEventDispatcher();
  export let manifest;
  let selectedIndex = 0;
  $: selected = manifest.items[selectedIndex];

  let sortList = ev => {
    manifest.items = ev.detail;
  };

  let selectCanvas = ev => {
    selectedIndex = ev.detail;
  };
</script>

<style>
  .selected {
    display: flex;
    /* list-style: none; */
    width: 100%;
  }
  .labelSection {
    display: flex;
    margin-left: 2rem;
  }
  .labelSectionInner {
    margin: auto;
  }
</style>

<div class="selected">
  <img src={selected.full} alt={selected.label} />
  <div class="labelSection">
    <div class="labelSectionInner">
      <label for="labelEdit">Edit canvas label</label>
      <input type="text" id="labelEdit" bind:value={selected.label} />
    </div>
  </div>
</div>

{#if manifest.items}
  <SortableList
    list={manifest.items}
    {selectedIndex}
    on:sort={sortList}
    on:canvasSelected={selectCanvas} />
{/if}
