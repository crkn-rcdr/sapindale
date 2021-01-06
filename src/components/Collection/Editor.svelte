<script>
  import { stores } from "@sapper/app";
  import { onMount } from "svelte";
  import SlugResolver from "../Slug/Resolver";
  import ParentsList from "./ParentsList";
  import ItemList from "./ItemList.svelte";
  import TextDisplay from "../IIIF/TextDisplay";
  import TextEditor from "../IIIF/TextEditor";
  import TypeAhead from "../Slug/TypeAhead.svelte";
  import Modal from "./Modal.svelte";
  import Content from "./Content.svelte";
  export let id = undefined;

  export let collection = {
    id,
    slug: "",
    label: {},
    summary: {},
    ordered: false,
    itemCount: 0,
    items: []
  };

  let addedItem = "";

  function selected(event) {
    addedItem = event.detail;
  }
  function addItem(addedItem) {
    collection.items[collection.items.length] = addedItem;

    addedItem = "";
  }
  export let parents = [];

  let currentSlug = collection.slug;
  let slugAvailable = true;
</script>

<style>
  .columns {
    display: flex;
  }
  .columns > * {
    flex: 0 1 100%;
  }
  .columns > *:not(:first-child) {
    margin-left: 2rem;
  }
</style>

<h1>Editing {collection.slug || 'a new collection'}</h1>

<div class="columns">
  <div>
    <SlugResolver
      inputLabel="Slug:"
      bind:value={currentSlug}
      bind:sameSlug={collection.slug}
      bind:available={slugAvailable} />
    <div class="children-inline">
      <label for="Ordered">Ordered:</label>
      <input type="checkbox" bind:checked={collection.ordered} />
    </div>
    <div>
      <label for="TextLabel">Label:</label>
      <TextEditor
        bind:data={collection.label}
        mandatory={true}
        textarea={false} />
    </div>

    <ParentsList {parents} />
  </div>

  <div>
    <h2>Items</h2>
    {#if collection.ordered}
      <ItemList bind:items={collection.items} />

      <TypeAhead label="Slug:" on:selected={selected} />
      {#if addedItem}
        <TextDisplay data={addedItem.label} />
        <button class="add" on:click={addItem(addedItem)}>Add To Item</button>
      {/if}
    {:else}
      <p>
        This collection has {collection.itemCount} items. You can add items
        (collections or manifests) to this collection below, and you can remove
        items from it by editing those items directly.
      </p>
    {/if}
    <Modal>
      <Content />
    </Modal>
    <p>TODO: implement adding items by batch</p>
  </div>
</div>
