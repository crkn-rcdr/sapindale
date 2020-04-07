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

<div class="mx-auto">
  <nav class="flex">
    <div class="flex-1">
      <figure class="flex content-center flex-wrap">
        <img
          class="object-scale-down h-50 w-20"
          src="/canadiana-logo.svg"
          alt="img" />
        <h1 class="text-center text-black pl-64">
          Canadiana access platform administration
        </h1>
      </figure>
    </div>
    <div>
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
      <div class="max-w-md mx-auto pt-64">
        <p class="text-white text-center text-xl bg-primary pt-8 py-2 m-2 h-24">
          Please log in to continue.
        </p>
      </div>
    {/if}
  </main>
</div>
