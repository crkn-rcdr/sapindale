<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { view } from "../components/ManifestView.svelte";

  const dispatch = createEventDispatcher();
  export let item;
  export let index;

  function clickForview(event) {
    dispatch("click", { item });
  }
</script>

<figure>
  <img
    src={item.thumbnail}
    alt={`thumbnail for image: ${item.label}`}
    on:click={clickForview} />
  <figcaption>{item.label}</figcaption>
</figure>
