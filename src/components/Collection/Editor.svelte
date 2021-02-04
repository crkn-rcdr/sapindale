<script>
  import { stores } from "@sapper/app";
  import { onMount } from "svelte";
  import SlugResolver from "../Slug/Resolver";
  import ParentsList from "./ParentsList";
  import ItemList from "./ItemList.svelte";
  import TextDisplay from "../IIIF/TextDisplay";
  import TextEditor from "../IIIF/TextEditor";
  import TypeAhead from "../Slug/TypeAhead.svelte";
  import Modal from "svelte-simple-modal";
  import Content from "./Content.svelte";
  import FaCheck from "svelte-icons/fa/FaCheck.svelte";

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

  let addValue = "";

  function addedValue(event) {
    addValue = event.detail;
  }
  function addItem(addValue) {
    addValue.forEach(element => {
      collection.items[collection.items.length] = element;
    });

    addValue = "";
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

      <Modal>
        <Content on:message={addedValue} />
      </Modal>
      {#if addValue}
        <ul>
          {#each addValue as result, i}
            <li>
              <TextDisplay data={result.label} />
            </li>
          {/each}
          <button class="add" on:click={addItem(addValue)}>
            Add to the list
          </button>
        </ul>
      {/if}
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
