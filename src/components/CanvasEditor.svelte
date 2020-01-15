<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { state as authState } from "../auth.js";
  import { canvasSelection } from "../couch.js";
  const dispatch = createEventDispatcher();
  export let Item = [];

  onMount(async () => {
    await canvasedit();
  });
  async function canvasedit() {
    try {
      let canvasview = await canvasSelection();
      let urltest = "https://placekitten.com/g/300/500?image=";
      Item = ["01", "02", "03", "04", "05"].map(num => urltest + num);
    } catch (ignore) {}
  }
</script>

<h1>template</h1>
{#each Item as src}
  <img {src} alt="alternate" />
{/each}
