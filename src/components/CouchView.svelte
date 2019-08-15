<script>
  import { onMount } from "svelte";
  import { state as authState } from "../auth.js";
  import { view } from "../couch.js";

  export let dbname, ddoc, viewname, options;
  let viewContents = [];
  $: token = $authState.token;

  onMount(async () => {
    try {
      viewContents = await view(token, dbname, ddoc, viewname, options).rows;
    } catch (err) {
      viewContents = [err];
    }
  });
</script>

{#if $authState.status === 'SUCCESS'}{viewContents}{/if}
