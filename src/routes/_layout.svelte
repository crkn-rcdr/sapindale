<script>
  import { state as authState } from "../auth.js";
  import { onMount } from "svelte";
  var redirectUrl;

  onMount(async () => {
    redirectUrl = window.location.origin;
  });
</script>

<style>

</style>

<svelte:head>
  <title>Sapindale — Canadiana access platform administration</title>
</svelte:head>

<nav>
  <div class="flex float-left p-4">
    <a href="/">Home</a>
  </div>
  <div class="flex float-right p-4">
    {#if $authState.status === 'SUCCESS'}
      Logged in as: {$authState.name}
    {:else}
      <a
        href="https://auth.canadiana.ca/1/azuread/login?redirectUrl={redirectUrl}">
        Login
      </a>
    {/if}
  </div>
</nav>

<main>
  {#if $authState.status === 'SUCCESS'}
    <slot />
  {:else}
    <h1>Canadiana access platform administration</h1>
    <p class="layout">Please log in to continue.</p>
  {/if}
</main>
