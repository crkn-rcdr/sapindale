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
  let changed;
  onMount(async () => {
    await typeLabel();
    fullImage = manifest.items[0];
  });
  async function typeLabel(event) {
    dispatch("deselected");
    manifest = testManifest(10);
    list = manifest.items;
    /* selected = manifest.items[0]; */
    /* console.log("selected value", manifest.items); */
  }
  let sortList = ev => {
    list = ev.detail;
  };
  function view(event) {
    fullImage = event.detail.item;
    /* console.log("image", fullImage); */
  }
  function changeImg(event) {
    dispatch("changed", { fullImage });
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
  /* figcaption {
    text-align: center;
    color: #98012e;
    text-transform: capitalize;
  } */
</style>

{#if fullImage}
  <img src={fullImage.full} alt={fullImage.label} />
  <input
    type="text"
    bind:value={fullImage.label}
    on:input={changeImg}
    on:clear={typeLabel} />
{/if}
{#if manifest.items}
  <div>
    <SortableList {list} key="id" on:sort={sortList} let:item let:index>
      <CanvasViewer {item} {index} on:click={view} />
    </SortableList>
  </div>
{/if}
