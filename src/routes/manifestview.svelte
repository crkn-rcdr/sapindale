<script>
  import ManifestView from "../components/ManifestView.svelte";
  import SortableList from "../components/SortableList.svelte";
  import CanvasEditor, { Item } from "../components/CanvasEditor.svelte";
  import { setContext } from "svelte";
  import { readable } from "svelte/store";

  /* let list = [
    { id: 1, name: "oocihm" },
    { id: 2, name: "asm" },
    { id: 3, name: "detaildesign" },
    { id: 4, name: "fourth" },
    { id: 5, name: "fifth" },
    { id: 6, name: "sixth" },
    { id: 7, name: "seventh" }
  ]; */
  let list = [Item];
  let typeLabel;
  let selectedName;
  let activeItem;
  let sortList = ev => {
    list = ev.detail;
  };
  export function view(event) {
    selectedName = event.detail.item;
    activeItem = selectedName;
  }
  function changeImg(event) {
    typeLabel = event.detail.fullImage;
    console.log("type", typeLabel);
  }
  function clear(event) {
    typeLabel = undefined;
  }
</script>

<svelte:head>
  <title>Sapindale — Manifest Editor</title>
</svelte:head>
<h1>Manifest Editor</h1>
{#if selectedName !== undefined}
  <span class="border border-canadiana p-2">
    {selectedName.id} {selectedName.name}
  </span>
{/if}
<br />
<div>

  <CanvasEditor on:changed={changeImg} on:deselected={clear} />

</div>
