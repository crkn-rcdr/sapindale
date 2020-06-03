<script>
  import { state as authState } from "../auth.js";
  import { createEventDispatcher } from "svelte";
  import { resolve as resolveSlug } from "../api/slug.js";
  import spinner from "../spinner.svelte";
  import SlugTypeAhead from "../components/SlugTypeAhead.svelte";

  let token = $authState.token;
  const dispatch = createEventDispatcher();
  let value = "";
  let id, db;
  let slugFound = false;
  let slugCheckPending, slugList;
  let slugId = "";

  async function lookUpSlug() {
    dispatch("deselected");
    try {
      slugCheckPending = true;
      slugList = await resolveSlug(token, value);
      slugId = slugList.id;
      await check(slugId);
    } catch (ignore) {}
    return slugId;
  }
  async function check(slugId) {
    if (!slugId) {
      slugCheckPending = false;
      slugFound = false;
    } else {
      slugCheckPending = false;
      slugFound = true;
    }
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
    display: flex;
    flex-direction: column;
  }
  .spinnerbind {
    display: inline;
  }
  .display {
    padding-top: 5%;
  }
</style>

<div>
  <div class="slug">
    <label for="slug">Slug</label>
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

</div>
