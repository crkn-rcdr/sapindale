<script>
  import TypeAhead from "../components/TypeAhead.svelte";
  import result from "../components/TypeAhead.svelte";
  import results from "../components/TypeAhead.svelte";
  import value from "../components/TypeAhead.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let id = results.id;
  $: selectedId = "";

  function filterId() {
    selectedId = `${id}`;

    dispatch("message", {
      text: selectedId
    });
  }
</script>

<style>
  li {
    position: relative;
    list-style: none;
    line-height: 1.8em;
    cursor: pointer;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }

  li:hover {
    color: #98012e;
  }

  li:after {
    position: absolute;
    top: 2.1em;
    left: 0.9em;
    width: 2px;
    height: calc(100% - 2em);
    content: "";
    z-index: 0;
  }
</style>

<li class="highlight" on:click={filterId}>{id}</li>
