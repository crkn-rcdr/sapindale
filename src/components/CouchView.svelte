<script>
  import { onMount } from "svelte";
  import { state as authState } from "../auth.js";
  import { view } from "../couch.js";

  export let dbname, ddoc, viewname, options;
  let viewContents = [];
  $: token = $authState.token;

  function checkToken() {
    fetch("https://auth.canadiana.ca/1/auth").then(function(res) {
      if (res.status === 401) {
        console.log("EXPIRED");
      }
    });
  }
  onMount(async () => {
    const interval = setInterval(() => {
      try {
        viewContents = view(token, dbname, ddoc, viewname, options).rows;
      } catch (err) {
        viewContents = [err];
      }
      if (!token) {
        checkToken();
      }
    }, 10000);
  });
</script>

{#if $authState.status === 'SUCCESS'}{viewContents}{/if}
