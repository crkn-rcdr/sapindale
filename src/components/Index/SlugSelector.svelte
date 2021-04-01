<script>
  import { goto } from "@sapper/app";
  import SlugTypeAhead from "../Slug/TypeAhead";
  // let type = "manifest";

  async function selected(event) {
    let selection = event.detail;
    await goto(`/access/${selection.id}`);
  }
</script>

<SlugTypeAhead label="Slug:" on:selected={selected} />
