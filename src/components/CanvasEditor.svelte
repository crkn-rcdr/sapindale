<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { stores } from "@sapper/app";
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
    list-style: none;

    padding-right: 10%;
    /* height: 100%; */
    /*  padding-right: 2%;
    float: right;
  } */
  }

  .labelSection {
    margin-left: 2rem;
  }
  .labelSectionInner {
    margin: auto;
  }
  .globe {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: space-between;
  }
</style>

<div class="globe">
  <div class="selected p-2">
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
</div>
