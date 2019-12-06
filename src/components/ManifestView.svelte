<script>
  import { createEventDispatcher } from "svelte";
  import { state as authState } from "../auth.js";

  export let item;
  export let index;
  let selectedName;

  function view(ev, item) {
    selectedName = item.name;
  }
</script>

<style>
  ul li {
    padding: 10px;
    list-style-type: none;
    margin: 0 10px 10px 0;
    cursor: pointer;
  }
  ul li:hover {
    background: #98012e;
    color: white;
  }
</style>

<ul>
  <li class="border border-canadiana" on:click={event => view(event, item)}>
    {index + 1} {item.name}
  </li>
</ul>
{#if selectedName !== undefined}
  <span>{selectedName}</span>
{/if}
