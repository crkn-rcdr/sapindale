<script>
  import { goto } from "@sapper/app";
  import { removeNoidPrefix } from "../../api";
  import SlugTypeAhead from "../Slug/TypeAhead";
  let type = "manifest";

  async function selected(event) {
    let noid = removeNoidPrefix(event.detail.noid);
    await goto(`/${type}/${noid}`);
  }
</script>

<SlugTypeAhead bind:type label="Slug:" on:selected={selected} />
