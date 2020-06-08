<script>
  import { state as authState } from "../auth.js";
  import { createEventDispatcher, onMount } from "svelte";
  import { resolve as resolveSlug } from "../api/slug.js";
  import spinner from "../spinner.svelte";
  import SlugTypeAhead from "../components/SlugTypeAhead.svelte";

  let token = $authState.token;
  const dispatch = createEventDispatcher();
  export let value, label;
  let id, db;
  let slugFound = false;
  let slugCheckPending, slugList;
  let slugId = "";

  onMount(async () => {
    if (typeof value !== "string") {
      value = "";
    } else {
      lookUpSlug();
    }
    if (typeof label !== "string") {
      label = "Slug";
    }
  });

  async function lookUpSlug() {
    dispatch("deselected");
    try {
      slugCheckPending = true;
      slugList = await resolveSlug(token, value);
      slugId = slugList.id;
      slugCheckPending = false;
      slugFound = !!slugId;
    } catch (ignore) {}
  }

  async function slugSelect(event) {
    dispatch("searched", { value });
  }
</script>

<style>
  /* .lab {
    width: 100%;
  } */

  .slug {
    display: inline;
  }
  .spinnerbind {
    display: inline;
  }
  .display {
    padding-top: 5%;
  }
</style>

<div class="slug">
  <label for="slug">{label}</label>
  <div class="spinnerbind">
    <input
      type="text"
      bind:value
      on:input={lookUpSlug}
      on:change={slugSelect} />

    {#if slugCheckPending}
      <spinner />
    {:else if slugFound && slugCheckPending != undefined && value != ''}
      <span>❌ : Found in Database</span>
    {:else if !slugFound && slugCheckPending != undefined && value != ''}
      <span>✅ : Not found in Database</span>
    {/if}
  </div>
  {#if slugFound}
    <div class="display">
      <h3>Slug Details</h3>
      <ul>
        {#each Object.keys(slugList) as item}
          <li>{item}:{slugList[item]}</li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
