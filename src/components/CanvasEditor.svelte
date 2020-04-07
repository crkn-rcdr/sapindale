<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { state as authState } from "../auth.js";
  import { testCantaloupe } from "../couch.js";
  import SortableList from "../components/SortableList.svelte";

  export let items;
  let selectedIndex = 0;
  let reordered;
  let sortList = ev => {
    items = ev.detail;
    dispatch("reorderedList", { items });
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
    /* display: flex; */
    /* list-style: none; */
    width: 50%;
    height: 100%;
    padding-right: 2%;
    float: right;
  }
  .labelSection {
    display: flex;
    margin-left: 2rem;
  }
  .labelSectionInner {
    margin: auto;
  }
</style>

<div class="selected w-1/2 p-2">
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
