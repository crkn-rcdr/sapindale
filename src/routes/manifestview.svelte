<script>
  import ManifestView from "../components/ManifestView.svelte";
  import SortableList from "../components/SortableList.svelte";

  let list = [
    { id: 1, name: "oocihm" },
    { id: 2, name: "asm" },
    { id: 3, name: "detaildesign" }
  ];
  let selectedName;
  let sortList = ev => {
    list = ev.detail;
  };
  function view(event) {
    selectedName = event.detail.item;
  }
</script>

<svelte:head>
  <title>Sapindale — Manifest Editor</title>
</svelte:head>
<h1>Manifest Editor</h1>
<br />
{#if selectedName !== undefined}
  <span class="border border-canadiana p-2">
    {selectedName.id} {selectedName.name}
  </span>
{/if}
<br />
<SortableList {list} key="id" on:sort={sortList} let:item let:index>
  <ManifestView {item} {index} on:click={view} />
</SortableList>
