<script>
  import { state as authState } from "../auth.js";
  import { onMount, afterUpdate } from "svelte";
  import SlugResolver from "../components/SlugResolver.svelte";
  import { getCollection } from "../api/collection.js";
  import TextValueEditor from "../components/TextValueEditor.svelte";
  import SortableList from "../components/SortableList.svelte";
  import IIIFTextDisplay from "./IIIFTextDisplay";

  export let id = undefined;

  let token = $authState.token;
  $: collection = {
    id,
    slug: "",
    label: {},
    summary: {},
    ordered: false,
    public: false,
    items: [],
    parents: []
  };
  let summaryDisplay = false;
  let showCreate = true;
  let reduceParents = {};

  onMount(async () => {
    await getCollectionRecords({ id });
  });

  async function getCollectionRecords({ id }) {
    try {
      // TODO: this lookup can fail if the id isn't good
      collection = Object.assign(collection, await getCollection(token, id));

      console.log("collection", collection);
    } catch (ignore) {}
  }

  function displayItems(event) {
    item = rowcount.items;
    dispatch("select", { index });
  }
  function addSummary() {
    if (Object.getOwnPropertyNames(collection.summary).length === 0) {
      summaryDisplay = true;
      showCreate = false;
    }
  }
</script>

<style>
  /* .line {
    display: -webkit-box;
  } */

  .scroll {
    overflow-y: scroll;
    height: calc(100vh - 450px);
    width: calc(100% - 100px);
    background-color: var(--color-secondary-accent);
    color:var(--color-text);
  }
  section {
    display: block;
  }
  .left {
    width: 50%;
    position: fixed;
    float: left;
  }
  .right {
    float: right;
    width: 50%;
  }
</style>

<!-- <div class="left">
  <span class="children-inline">
    <label for="id">Id:</label>
    <input type="text" bind:value={collection.id} readonly />
  </span>
  <label for="slug">Slug:</label>
  <input type="text" bind:value={collection.slug} />
  <span class="children-inline">
    <label for="Ordered">Ordered:</label>
    <input type="checkbox" bind:checked={collection.ordered} />
  </span>
  <label for="public">Public:</label>
  <input type="text" bind:value={collection.public} readonly />
  <label for="label">Label:</label>
  <TextValueEditor
    bind:data={collection.label}
    mandatory={true}
    textarea={false} />
  <label for="summary">Summary</label>
  {#if summaryDisplay}
    <TextValueEditor
      bind:data={collection.summary}
      mandatory={false}
      textarea={true} />
  {/if}
  {#if showCreate}
    <button class="create" on:click|preventDefault={addSummary}>
      Add New Summary
    </button>
  {/if}
  <label for="parents">Parents:</label>
  {#each collection.parents as parent}
    <ul>
      <li>
        <a href="/collection/{encodeURIComponent(parent.id)}" rel="external">
          {parent.slug}
        </a>
      </li>
      <li>slug:{parent.slug}</li>
      <li>
        label:
        <IIIFTextDisplay data={parent.label} />
      </li>

    </ul>
  {/each}
</div>
<div class="view">
  <aside>
    <label for="items">Items:</label>
    <div class="scroll">

      {#each collection.items as item}
        <ul>
          <li>id:{item.id}</li>
          <li>slug:{item.slug}</li>
          <li>public:{item.public}</li>
          <li>type:{item.type}</li>
          <li>
            label:
            <IIIFTextDisplay data={item.label} />
          </li>

        </ul>
      {/each}

    </div>
  </aside>
</div> -->

<section class="left">
  <article class="children-inline">
    <h4>Id:</h4>
    <input type="text" bind:value={collection.id} readonly />
  </article>
  <article class="children-inline">
    <h4>Slug:</h4>
    <input type="text" bind:value={collection.slug} />
  </article>
  <article class="children-inline">
    <h4>Ordered:</h4>
    <input type="checkbox" bind:checked={collection.ordered} />
  </article>
  <article class="children-inline">
    <h4>Public:</h4>
    <input type="text" bind:value={collection.public} readonly />
  </article>
  <article>
    <h4>Label:</h4>
    <TextValueEditor
      bind:data={collection.label}
      mandatory={true}
      textarea={false} />
    <label for="summary">Summary</label>
    {#if summaryDisplay}
      <TextValueEditor
        bind:data={collection.summary}
        mandatory={false}
        textarea={true} />
    {/if}
    {#if showCreate}
      <button class="create" on:click|preventDefault={addSummary}>
        Add New Summary
      </button>
    {/if}
  </article>
  <article>
    <h4>Parents:</h4>
    {#each collection.parents as parent}
      <ul>
        <li>
          <a href="/collection/{encodeURIComponent(parent.id)}" rel="external">
            {parent.slug}
          </a>
        </li>
        <li>slug:{parent.slug}</li>
        <li>
          label:
          <IIIFTextDisplay data={parent.label} />
        </li>

      </ul>
    {/each}
  </article>
</section>
<section class="right">
  <h4>Items:</h4>
  <article class="scroll">

    {#each collection.items as item}
      <ul>
        <li>id:{item.id}</li>
        <li>slug:{item.slug}</li>
        <li>public:{item.public}</li>
        <li>type:{item.type}</li>
        <li>
          label:
          <IIIFTextDisplay data={item.label} />
        </li>

      </ul>
    {/each}

  </article>
</section>
