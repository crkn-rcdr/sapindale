<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { state as authState } from "../auth.js";

  let item;
  let index;
  let selectedName;
  let list = [
    { id: 1, name: "oocihm" },
    { id: 2, name: "asm" },
    { id: 3, name: "design" }
  ];
  async function dragstart(ev, item) {
    ev.dataTransfer.setData("item", item);
  }
  async function dragover(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  }
  async function drop(ev, new_g) {
    ev.preventDefault();
    var old_g = ev.dataTransfer.getData("item");
    const item = list.splice(old_g, 1)[0];
    list.push(item);
    $: list = list;
  }
  async function view(ev, item) {
    selectedName = item.name;
  }
</script>

<style>
  ul li {
    padding: 10px;
    list-style-type: none;
    margin: 0 10px 10px 0;
    background: #f9f9f9;
    display: inline-block;
    cursor: pointer;
  }
</style>

<h1>Manifest List Demo</h1>
<ul on:drop={event => drop(event, list)} on:dragover={dragover}>
  {#each list as item, i}
    <li
      draggable={true}
      on:click={event => view(event, item)}
      on:dragstart={event => dragstart(event, i)}>
      {item.id} {item.name}
    </li>
  {/each}
</ul>
{#if selectedName !== undefined}
  <span>{selectedName}</span>
{/if}
