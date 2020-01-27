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
  let fullImage;
  onMount(async () => {
    manifest = testManifest(10);
    list = manifest.items;
    selected = manifest.items[0];
    /* console.log("selected value", manifest.items); */
  });
  let sortList = ev => {
    list = ev.detail;
  };
  function view(event) {
    fullImage = event.detail.item;
    /* console.log("image", fullImage); */
  }
</script>

<style>
  /* .thumbList {
    display: flex;
    margin-top: 1em;
    width: 100%;
    overflow-x: scroll;
    display: inline-block;
  }
  .thumbList * + * {
    margin-left: 1em;
  } */
</style>

{#if fullImage}
  <img src={fullImage.full} alt={fullImage.label} />
{/if}
{#if manifest.items}
  <div>
    <SortableList {list} key="id" on:sort={sortList} let:item let:index>
      <CanvasViewer {item} {index} on:click={view} />
    </SortableList>
  </div>
{/if}
