<script>
  import { stores, goto } from "@sapper/app";
  import { onMount, afterUpdate, createEventDispatcher } from "svelte";
  import { getCollection } from "../../api/collection";
  import SlugResolver from "../Slug/Resolver.svelte";
  import ItemList from "./ItemList.svelte";
  import TextDisplay from "../IIIF/TextDisplay";
  import TextEditor from "../IIIF/TextEditor";
  import TypeAhead from "../Slug/TypeAhead.svelte";

  export let id = undefined;

  export let collection = {
    id,
    slug: "",
    label: {},
    summary: {},
    ordered: false,
    public: false,
    items: [],
    parents: []
  };
  console.log("collection", collection);
  let item = [];

  let initialSlug = collection.slug;
  let initialOrdered = collection.ordered;
  let selectFlag = false;
  async function selected(event) {
    selectFlag = "true";
    item = event.detail;
  }
  function addItem(item) {
    collection.items.push(item);
    console.log("Updated Collection Items:", collection.items);
  }
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
  table {
    white-space: normal;
  }
</style>

<h1>
  {#if initialSlug}Editing {initialSlug}{:else}Editing a new collection{/if}
</h1>

<div class="columns">
  <div>
    <div class="children-inline">
      <label for="Slug">Slug:</label>
      <input type="text" bind:value={collection.slug} />
    </div>
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

    <h2>Parent Collections</h2>
    {#if collection.parents.length > 1}
      <table>
        {#each collection.parents as parent}
          <tr>
            <td>
              <a
                rel="external"
                href="/collection/{encodeURIComponent(parent.id)}">
                {parent.slug}
              </a>
            </td>
            <td>
              <TextDisplay data={parent.label} />
            </td>
            <td>Remove (TODO)</td>
          </tr>
        {/each}
      </table>
    {/if}
    <p>TODO: add an "Add to collection" interface</p>
    <p>
      TODO: add context-sensitive buttons for creating, updating, and/or
      publishing the collection
    </p>
  </div>

  <div>
    <h2>Items</h2>
    {#if initialOrdered}
      <ItemList bind:items={collection.items} />

      <p>TODO: implement adding a single item</p>
      <div>
        <TypeAhead label="Slug:" on:selected={selected} />
        {#if selectFlag}
          <TextDisplay data={item.label} />
          <button class="add" on:click={addItem(item)}>Add To Item</button>
        {/if}
      </div>
    {:else}
      <p>
        This collection has {collection.itemCount} items. You can add items
        (collections or manifests) to this collection below, and you can remove
        items from it by accessing the editor for those items directly.
      </p>
    {/if}
    <p>TODO: implement adding items by batch</p>
  </div>
</div>
