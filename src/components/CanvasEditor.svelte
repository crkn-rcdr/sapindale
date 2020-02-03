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
  }
  let sortList = ev => {
    list = ev.detail;
  };
  function view(event) {
    fullImage = event.detail.item;
  }
  function changeImg(event) {
    let inputId = fullImage.label.charAt(fullImage.label.length - 1);
    fullImage.id = inputId;
    fullImage.full = fullImage.full.replace(/.$/, inputId);
    fullImage.thumbnail = fullImage.thumbnail.replace(/.$/, inputId);

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
  /*  .labelField {
    float: right;
  } */
  .labelField {
    display: flex;
    /* list-style: none; */
    width: 100%;
  }
  .labelField li + li {
    display: inline-block;
    padding: 30% 0% 0% 2%;
  }
</style>

{#if fullImage}
  <ul class="labelField">
    <li>
      <img src={fullImage.full} alt={fullImage.label} />
    </li>
    <li>
      <input
        type="text"
        bind:value={fullImage.label}
        on:input={changeImg}
        on:clear={typeLabel} />
    </li>

  </ul>
{/if}

{#if manifest.items}
  <div>
    <SortableList {list} key="id" on:sort={sortList} let:item let:index>
      <CanvasViewer {item} {index} on:click={view} />
    </SortableList>
  </div>
{/if}
