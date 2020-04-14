<script>
  import CollectionMember from "../components/CollectionMember.svelte";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<style>
  .lab {
    width: 100%;
  }
</style>

<div class="flex">
  <div class="lab m-2">
    <div class="flex pt-8">
      <label for="slug" class="px-4">Slug</label>
      <input type="text" />
    </div>
    <div class="flex pt-8">
      <label for="label" class="px-3">Label</label>
      <input type="text" />
    </div>
    <div class="flex pt-8">
      <input type="checkbox" />
      <p class="pl-2">Ordered?</p>
    </div>
    <div class="pt-8">
      <a
        class="flex-1 text-white text-center bg-primary pt-2 py-2 m-2 "
        href="/"
        alt="save">
        Save
      </a>
      <a
        class="flex-1 text-white text-center bg-primary pt-2 py-2 m-2 "
        href="/"
        alt="save">
        Save & Publish
      </a>
    </div>
  </div>
  <CollectionMember />
</div>
