<script>
  import { stores } from "@sapper/app";
  import { onMount, afterUpdate } from "svelte";
  import SlugResolver from "../Slug/Resolver.svelte";
  import ItemList from "./ItemList.svelte";
  import TextDisplay from "../IIIF/TextDisplay";
  import TextEditor from "../IIIF/TextEditor";

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

  export let parents = [];
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

<h1>Editing {collection.slug || 'a new collection'}</h1>

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
    {#if parents.length > 1}
      <table>
        {#each parents as parent}
          <tr>
            <td>
              <a href="/collection/{parent.id}">{parent.slug}</a>
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
    {#if collection.ordered}
      <ItemList bind:items={collection.items} />
      <p>TODO: implement adding a single item</p>
    {:else}
      <p>
        This collection has {collection.itemCount} items. You can add items
        (collections or manifests) to this collection below, and you can remove
        items from it by editing those items directly.
      </p>
    {/if}
    <p>TODO: implement adding items by batch</p>
  </div>
</div>
