<script>
  import { onMount } from "svelte";
  import Spinner from "svelte-spinner";
  export let value = "",
    sameSlug = "",
    inputLabel = "Slug:",
    available;
  let loading = false,
    busted = false;

  let slug = null;
  $: available =
    !loading && !busted && value.length > 0 && (value === sameSlug || !slug);

  async function resolve() {
    if (value.length > 0) {
      if (value === sameSlug) {
        // Passed in both values, being the same means that it was found already.
        slug = { id: value, type: "none" };
      } else {
        loading = true;
        busted = false;
        const response = await fetch(`/manifest/slug/available/${value}.json`, {
          method: "POST",
          credentials: "same-origin"
        });
        if (response.status === 200) {
          let json = await response.json();
          if (json.id) {
            slug = json;
          } else {
            slug = null;
          }
        } else {
          busted = true;
          slug = null;
          value = sameSlug;
        }
        loading = false;
      }
    } else if (sameSlug.length > 0) {
      // sameSlug was set to a value
      slug = { id: value, type: "none" };
    }
  }

  onMount(async () => {
    await resolve();
  });
</script>

<div class="children-inline">
  <label for="slug">{inputLabel}</label>
  <input type="text" bind:value on:input={resolve} />

  {#if loading}
    <Spinner />
  {:else if busted}
    <span class="danger">Server error.</span>
  {:else if slug}
    ❌
    <a href="/{slug.type}/{slug.id}">Slug in use</a>
  {:else if available}✅ Slug available{/if}
</div>
