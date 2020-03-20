<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let item, index, selected;
  function dispatchClick(event) {
    dispatch("canvasSelected", index);
  }
</script>

<style>
  figure {
    cursor: pointer;
  }

  figure.selected {
    border: 2px #1d808b solid;
  }

  figcaption {
    text-align: left;
    color: #1d808b;
  }
  img {
    max-width: 50%;
    height: auto;
  }
</style>

<figure on:click={dispatchClick} class:selected>
  <img src={item.thumbnail} alt={`thumbnail for image: ${item.label}`} />
  <figcaption>{item.label}</figcaption>
</figure>
