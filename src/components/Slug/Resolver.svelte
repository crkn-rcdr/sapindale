<script>
  import { onMount } from "svelte";
  import Spinner from "svelte-spinner";

  /**
   * @type {string} Slug being resolved.
   */
  export let slug = "";
  /**
   * @type {string | null} Noid that the slug resolves to, or null if it doesn't.
   * If this is provided, the resolver will trust that it's correct.
   */
  export let noid = null;
  /**
   * @type {boolean} Whether to hide the display when the current slug is the
   * same as the initial slug provided.
   */
  export let hideInitial = false;
  /** @type {string} Label for the slug text input. */
  export let inputLabel = "Slug:";
  /** @type {string} Response for when a slug is in use. */
  export let inUseLabel = "⚠️ Slug in use";
  /** @type {string} Response for when a slug is not in use. */
  export let availableLabel = "✅ Slug available";

  // https://github.com/crkn-rcdr/Access-Platform/blob/main/data/src/format/slug.ts
  const regex = /^[\p{L}\p{Nl}\p{Nd}\-_\.]+$/u;

  const initial = { slug, noid };
  $: shouldQuery = !!slug && !(slug === initial.slug && initial.noid);

  /** @type {"READY" | "LOADING" | "MALFORMED" | "ERROR"} */
  let status = initial.noid ? "READY" : "LOADING";

  async function resolve() {
    if (shouldQuery) {
      if (regex.test(slug)) {
        console.log("query");
        status = "LOADING";
        const response = await fetch(`/slug/${slug}.json`, {
          method: "GET",
          credentials: "same-origin",
        });
        if (response.status === 200) {
          noid = await response.json();
          status = "READY";
        } else {
          noid = null;
          status = "ERROR";
        }
      } else {
        noid = null;
        status = "MALFORMED";
      }
    } else if (slug === initial.slug) {
      noid = initial.noid;
    }
  }

  onMount(async () => {
    await resolve();
    initial.noid = noid;
  });
</script>

<div class="children-inline">
  <label for="slug">{inputLabel}</label>
  <input type="text" bind:value={slug} on:input={resolve} />

  {#if !(hideInitial && slug === initial.slug)}
    {#if status === "LOADING"}
      <Spinner />
    {:else if status === "ERROR"}
      <span class="danger">Slug resolver unavailable.</span>
    {:else if status === "MALFORMED"}
      Slugs can only contain letters, numbers, and the following symbols: <code
        >_ - .</code
      >
    {:else if noid}
      <a href="/access/{noid}">{inUseLabel}</a>
    {:else}
      {availableLabel}
    {/if}
  {/if}
</div>
