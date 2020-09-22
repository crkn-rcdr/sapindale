<script>
  import { onMount } from "svelte";
  import { stores } from "@sapper/app";

  const { session } = stores();
  let token = $session.token;

  export let id = undefined;
</script>

{#if id}ID={id}{:else}Undefined ID{/if}
