<script>
  import FaArrowsAlt from "svelte-icons/fa/FaArrowsAlt.svelte";
  import IIIFTextDisplay from "./IIIFTextDisplay";

  /*  export let data = {}; */
</script>

<style>
  .dragHand {
    height: 50%;
    width: 50%;
    display: inline-flex;
    color: red;
  }
</style>

<div class="dragHand">
  <slot />
</div>
