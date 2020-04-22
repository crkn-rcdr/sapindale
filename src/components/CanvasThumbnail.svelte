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
  let updateLabel = _ev => {
    dispatch("imageUpdate", true);
  };
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

  #thumblabel {
    /* display: flex; */
    text-align: center;
    color: #1d808b;
  }
  /* img {
    max-width: 100%;
    height: auto;
    min-width: 50%;
  } */
</style>

<div class="flex content-start flex-start">
  <figure on:click={dispatchClick} class:selected use:lazyLoad>
    {#if src}
      <div class="w-1/3">
        <img
          src={`${src.thumbnail}`}
          alt={`thumbnail for image: ${src.label}`} />
        <!--  <figcaption>{src.label}</figcaption> -->
      </div>
      <div class="w-1/3">
        <input
          id="thumblabel"
          type="text"
          bind:value={src.label}
          on:input={updateLabel} />
      </div>
    {/if}
  </figure>
</div>
