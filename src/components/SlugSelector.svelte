<script>
  import { goto } from "@sapper/app";
  import SlugTypeAhead from "../components/SlugTypeAhead.svelte";
  let type = "manifest";

  async function selected(event) {
    await goto(`/${type}/${encodeURIComponent(event.detail.noid)}`);
  }
</script>

<SlugTypeAhead bind:type label="Slug:" on:selected={selected} />
