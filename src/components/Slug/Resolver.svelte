<script>
  import { stores } from "@sapper/app";
  import { createEventDispatcher, onMount } from "svelte";
  import { resolveSlug as resolveCollectionSlug } from "../../api/collection";
  import { resolveSlug as resolveManifestSlug } from "../../api/manifest";
  import Spinner from "svelte-spinner";
  const { session } = stores();
  let token = $session.token;
  export let value = "",
    label = "Slug",
    mode = "manifest",
    state = "PENDING";

  let slug;
  let resolveMethod =
    mode === "manifest" ? resolveManifestSlug : resolveCollectionSlug;

  onMount(async () => {
    if (value !== "") {
      lookUpSlug();
    }
  });

  async function lookUpSlug() {
    try {
      state = "PENDING";
      slug = await resolveMethod(token, value);
      // errors will come with a "message" field.
      // In the future, API requests should provide more explicit distinction
      if (slug.message) {
        state = "NOTFOUND";
      } else {
        state = "FOUND";
      }
    } catch (ignore) {
      state = "FAILED";
    }
  }
  function noidClick(event) {
    let noidValue = encodeURIComponent(slugList.noid);
    let noidType = slugList.type;
    dispatch("selected", { noidValue, noidType });
  }
</script>

<span class="children-inline">
  <label for="slug">{label}</label>
  <input type="text" bind:value on:input={lookUpSlug} />

  {#if state === 'FOUND'}
    ❌ :
    <a href="/{slug.type}/{encodeURIComponent(slug.noid)}">Slug in use</a>
  {:else if state === 'NOTFOUND'}
    ✅ : Slug available
  {:else if state === 'FAILED'}
    Error searching for slugs.
  {:else if value.length > 0}
    <Spinner />
  {/if}
</span>
