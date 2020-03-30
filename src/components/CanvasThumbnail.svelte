<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let item, index, selected;
  export let lazy = true;
  let src = item;
  let observer = null;
  function dispatchClick(event) {
    dispatch("canvasSelected", index);
  }
  if (lazy) {
    src = "";
    observer = new IntersectionObserver(onIntersect);
  }

  function onIntersect(entries) {
    if (!src && entries[0].isIntersecting) {
      src = item;
    }
  }

  function lazyLoad(node) {
    observer && observer.observe(node);
    return {
      destroy() {
        observer && observer.unobserve(node);
      }
    };
  }
</script>

<style>
  figure {
    cursor: pointer;
    /*  display: flex; */
    /* width: 150px; */
  }

  figure.selected {
    border: 2px #1d808b solid;
  }

  figcaption {
    text-align: center;
    color: #1d808b;
  }
  img {
    max-width: 100%;
    height: auto;
    /*  min-width: 50%; */
    /* max-width: 100%;
    height: auto;
    overflow-y: scroll; */
  }
</style>

<figure on:click={dispatchClick} class:selected use:lazyLoad>
  {#if src}
    <img src={`${src.thumbnail}`} alt={`thumbnail for image: ${src.label}`} />
    <figcaption>{src.label}</figcaption>
  {/if}
</figure>
