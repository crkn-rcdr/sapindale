<script>
  import { state as authState } from "../auth.js";
  import { onMount } from "svelte";
  import SlugResolver from "../components/SlugResolver.svelte";
  import { getCollection } from "../api/collection.js";
  import TextValueEditor from "../components/TextValueEditor.svelte";
  import SortableList from "../components/SortableList.svelte";
  import IIIFTextDisplay from "./IIIFTextDisplay";

  export let id = undefined;

  let token = $authState.token;
  let collection = {
    id,
    slug: "",
    label: {},
    summary: {},
    ordered: false,
    public: false,
    items: [],
    parents: []
  };
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
</script>

<style>
  /* .line {
    display: -webkit-box;
  } */

  .scroll {
    overflow-y: scroll;
    height: calc(100vh - 300px);
    width: 50%;
    background-color: #1d808b15;
    color: #141010;
  }
</style>

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

<TextValueEditor
  bind:data={collection.summary}
  mandatory={false}
  textarea={true} />

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
<label for="parents">Parents:</label>
{#each collection.parents as parent}
  <ul>
    <li>id:{parent.id}</li>
    <li>slug:{parent.slug}</li>
    <li>
      label:
      <IIIFTextDisplay data={parent.label} />
    </li>

  </ul>
{/each}
