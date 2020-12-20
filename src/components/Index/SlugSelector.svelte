<script>
  import { goto } from "@sapper/app";
  import SlugTypeAhead from "../Slug/TypeAhead";
  let type = "manifest";

  async function selected(event) {
    await goto(`/${type}/${event.detail.noid}`);
  }
</script>

<SlugTypeAhead bind:type label="Slug:" on:selected={selected} />
