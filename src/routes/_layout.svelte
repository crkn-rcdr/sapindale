<script>
  import { state as authState } from "../auth.js";
  import { onMount } from "svelte";
  let redirectUrl = undefined;

  onMount(async () => {
    redirectUrl = window.location.origin;
  });
</script>

<svelte:head>
  <title>Sapindale — Canadiana access platform administration</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
  <nav class="flex">
    <a href="/">Home</a>
    <div class="ml-auto">
      {#if $authState.status === 'SUCCESS'}
        Logged in as: {$authState.name}
      {:else if $authState.status === 'FAILED'}
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
      <p>Please log in to continue.</p>
    {/if}
  </main>
</div>
