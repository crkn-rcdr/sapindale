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

  const expand = item => {
    collection.items = collection.items.map(s => {
      if (s.id === item.id) {
        activeId = item.id;
      }
      console.log("s", s);
      return s;
    });
    /*  let items = collection.items.map(s => s.id);
    let test = collection.items;
    console.log(test); */
  };
</script>

<style>
  .scroll {
    overflow-y: scroll;
    height: calc(100vh - 450px);
    width: calc(100% - 150px);
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
  article ul {
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

  {#if Object.getOwnPropertyNames(collection.parents).length > 1}
    <article>
      <h4>Parents:</h4>
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
    </article>
  {/if}
</section>

<section class="right">
  <div class="icon">
    {#if collection.ordered}
      <h4>Items:</h4>
      <FaListOl />
    {:else}
      <h4>Items:</h4>
      <FaListUl />
    {/if}
  </div>
  {#if collection.ordered}
    <article class="scroll">
      <DragDropList bind:data={collection.items} />
      {#each collection.items as item}
        <ul>
          <li>
            <!--  <DragDropList bind:data={collection.items} /> -->
            <!--  <button on:click={() => expand(item)}>{item.id}</button> -->

            {#if item.id == activeId}
              <div>
                <li>{item.id}</li>
                <li>{item.slug}</li>
                <li>{item.public}</li>
                <li>{item.type}</li>
                <li>
                  <IIIFTextDisplay data={item.label} />
                </li>
              </div>
            {/if}
          </li>
        </ul>
        <!-- <div>

          {#each collection.items as item}
            <ul>
              <li>{item.id}</li>
              <li>{item.slug}</li>
              <li>{item.public}</li>
              <li>{item.type}</li>
              <li>
                <IIIFTextDisplay data={item.label} />
              </li>

            </ul>
          {/each}
        </div> -->
      {/each}
    </article>
  {:else}
    <p>The Collection has {collection.itemCount} Items</p>
  {/if}

</section>
