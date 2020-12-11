<script>
  import { stores } from "@sapper/app";
  import { onMount, afterUpdate } from "svelte";
  import SlugResolver from "../components/SlugResolver.svelte";
  import { getCollection } from "../api/collection.js";
  import TextValueEditor from "../components/TextValueEditor.svelte";
  import DragDropList from "../components/DragDropList.svelte";
  import IIIFTextDisplay from "./IIIFTextDisplay";
  import FaAngleDown from "svelte-icons/fa/FaAngleDown.svelte";
  import FaListOl from "svelte-icons/fa/FaListOl.svelte";
  import FaListUl from "svelte-icons/fa/FaListUl.svelte";
  import IoIosArrowDropdown from "svelte-icons/io/IoIosArrowDropdown.svelte";

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
  let summaryDisplay = false;
  let showCreate = true;
  let reduceParents = {};
  let activeId = "";

  function addSummary() {
    if (Object.getOwnPropertyNames(collection.summary).length === 0) {
      summaryDisplay = true;
      showCreate = false;
    }
  }
</script>

<style>
  .scroll {
    overflow-y: scroll;
    height: calc(100vh - 450px);
    width: calc(100% - 300px);
    background-color: var(--color-secondary-accent);
    color: var(--color-text);
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
  div ul {
    list-style: none;
    width: 65%;
  }
  .icon {
    color: var(--color);
    display: inline-flex;
    height: 45px;
    width: 150px;
    align-items: center;
  }
</style>

<section class="left">
  <div class="children-inline">
    <label for="Id">Id:</label>
    <input type="text" bind:value={collection.id} readonly />
  </div>
  <div class="children-inline">
    <label for="Slug">Slug:</label>
    <input type="text" bind:value={collection.slug} />
  </div>
  <div class="children-inline">
    <label for="Ordered">Ordered:</label>
    <input type="checkbox" bind:checked={collection.ordered} />
  </div>
  <div class="children-inline">
    <label for="Public">Public:</label>
    <input type="text" bind:value={collection.public} readonly />
  </div>
  <div>
    <label for="TextLabel">Label:</label>
    <TextValueEditor
      bind:data={collection.label}
      mandatory={true}
      textarea={false} />
    <label for="summary">Summary:</label>
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
  </div>

  {#if Object.getOwnPropertyNames(collection.parents).length > 1}
    <div>
      <label for="Parents">Parents:</label>
      {#each collection.parents as parent}
        <ul>
          <li>
            <a href="/collection/{encodeURIComponent(parent.id)}">
              {parent.slug}
            </a>
          </li>
          <li>
            <IIIFTextDisplay data={parent.label} />
            (
            <a href={parent.noid}>{parent.slug}</a>
            )
          </li>

        </ul>
      {/each}
    </div>
  {/if}
</section>

<section class="right">
  <div class="icon">
    {#if collection.ordered}
      <label for="Items">Items:</label>
      <FaListOl />
    {:else}
      <label for="Items">Items:</label>
      <FaListUl />
    {/if}
  </div>
  {#if collection.ordered}
    <div class="scroll">
      <DragDropList bind:data={collection.items} />
      <!--This is to show the collection items changes after reordering-->
      {#each collection.items as item}
        <ul>
          <li>

            <div>

              <li>{item.slug}</li>

              <li>
                <IIIFTextDisplay data={item.label} />
              </li>
            </div>

          </li>
        </ul>
      {/each}

    </div>
  {:else}
    <p>The Collection has {collection.itemCount} Items</p>
  {/if}

</section>
