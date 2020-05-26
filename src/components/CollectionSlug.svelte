<script>
  import CollectionMember from "../components/CollectionMember.svelte";
  import { state as authState } from "../auth.js";
  import { createEventDispatcher } from "svelte";
  import { slugView, collectionLabel } from "../couch.js";
  import spinner from "../spinner.svelte";
  import TextValueEditor from "../components/TextValueEditor.svelte";

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
      slugList = await slugView(token, db, value);
      slugId = slugList._id;
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
  .collecDisplay {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: space-between;
    padding-top: 2%;
  }
  .slug {
    display: flex;
    flex-direction: column;
  }
  .ordered {
    display: flex;
    flex-direction: row;
    padding-top: 6%;
  }

  .spinnerbind {
    display: inline;
  }
  .buttons {
    display: inline;
  }
</style>

<div class="collecDisplay">
  <div class="slug">
    <label for="slug">Slug</label>
    <div class="spinnerbind">
      <input
        type="text"
        id={`${id}.input`}
        list={`${id}.slugList`}
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
    <!-- <label for="label">Label</label>
    <input type="text" />
    <button id="lab" on:click={labelLookUp}>check</button> -->

    <div class="ordered">
      <input type="checkbox" />
      <p>Ordered?</p>
    </div>
    <div class="buttons">
      <button id="save">Save</button>
      <button id="publish">Save & Publish</button>
    </div>
  </div>
  <CollectionMember />
</div>
<TextValueEditor />
