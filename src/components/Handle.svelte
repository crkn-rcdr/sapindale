<script>
  import FaArrowsAlt from "svelte-icons/fa/FaArrowsAlt.svelte";
  import IIIFTextDisplay from "./IIIFTextDisplay";

  /*  export let data = {}; */
</script>

<style>
  .dragHand {
    height: 20%;
    width: 20%;
    display: inline-flex;
    color: red;
  }
</style>

<aside class="dragHand">
  <slot />
</aside>
