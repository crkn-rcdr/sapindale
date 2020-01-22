<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { state as authState } from "../auth.js";
  import { testManifest } from "../couch.js";
  import SortableList from "../components/SortableList.svelte";
  import CanvasViewer from "../components/CanvasViewer.svelte";

  const dispatch = createEventDispatcher();
  let manifest = {};
  let selected;
  let item;
  let index;
  let list;
  onMount(async () => {
    manifest = testManifest(10);
    list = manifest.items;
    selected = manifest.items[0];
    console.log("selected value", manifest.items);
  });
  let sortList = ev => {
    list = ev.detail;
  };
  function view(event) {
    let fullImage = event.detail.item;
    console.log("image", fullImage);
  }
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
    <SortableList {list} key="id" on:sort={sortList} let:item let:index>
      <CanvasViewer {item} {index} on:click={view} />
    </SortableList>
  </div>
{/if}
