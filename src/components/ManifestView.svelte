<script>
  import { createEventDispatcher } from "svelte";
  import { stores } from "@sapper/app";
  const dispatch = createEventDispatcher();
  export let item;
  export let index;

  function clickForview(event) {
    dispatch("click", { item });
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
  <li class="border border-canadiana" on:click={clickForview}>
    {item.id} {item.name}
  </li>
</ul>
