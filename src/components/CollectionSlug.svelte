<script>
  import CollectionMember from "../components/CollectionMember.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
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
    padding-top: 4%;
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
  .lnkAction {
    display: flex;
    flex-direction: row;
    padding-top: 6%;
    background-color: #1d808b;
    justify-content: space-between;
    align-content: space-between;
  }
</style>

<div class="collecDisplay">
  <div class="slug">
    <label for="slug">Slug</label>
    <input type="text" />

    <label for="label">Label</label>
    <input type="text" />

    <div class="ordered">
      <input type="checkbox" />
      <p>Ordered?</p>
    </div>
    <div class="lnkAction">
      <div>
        <a href="/" alt="save">Save</a>
      </div>
      <div>
        <a href="/" alt="save">Save & Publish</a>
      </div>
    </div>
  </div>
  <CollectionMember />
</div>
