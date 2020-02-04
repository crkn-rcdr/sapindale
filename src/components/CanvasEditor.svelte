<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { state as authState } from "../auth.js";
  import { testManifest } from "../couch.js";
  import SortableList from "../components/SortableList.svelte";

  export let items;
  let selectedIndex = 0;

  let sortList = ev => {
    items = ev.detail;
  };

  let selectCanvas = ev => {
    selectedIndex = ev.detail;
  };

  const dispatch = createEventDispatcher();
  let update = _ev => {
    dispatch("manifestUpdate", true);
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
  <img src={items[selectedIndex].full} alt={items[selectedIndex].label} />
  <div class="labelSection">
    <div class="labelSectionInner">
      <label for="labelEdit">Edit canvas label</label>
      <input
        type="text"
        id="labelEdit"
        bind:value={items[selectedIndex].label}
        on:input={update} />
    </div>
  </div>
</div>

{#if items}
  <SortableList
    list={items}
    {selectedIndex}
    on:sort={sortList}
    on:canvasSelected={selectCanvas} />
{/if}
