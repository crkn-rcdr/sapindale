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

    /*  width: calc(100% - 400px); */
    margin-inline-start: auto;
  }

  figure.selected {
    border: 2px #1d808b solid;
  }

  /* #thumblabel {
    display: flex;
    flex-direction: unset;
    text-align: center;
    color: #1d808b;
  } */

  /* .thumbimg {
    width: calc(100% - 20px);
  } */
</style>

<div>
  <figure on:click={dispatchClick} class:selected use:lazyLoad>
    {#if src}
      <div>
        <img
          class="thumbimg"
          src={`${src.thumbnail}`}
          alt={`thumbnail for image: ${src.label}`} />
        <!--  <figcaption>{src.label}</figcaption> -->
      </div>
      <div>
        <input
          id="thumblabel"
          type="text"
          bind:value={src.label}
          on:input={updateLabel} />
      </div>
    {/if}
  </figure>
</div>
