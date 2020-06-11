<script>
  import { state as authState } from "../auth.js";
  import { onMount } from "svelte";
  let redirectUrl = undefined;

  export let segment;

  onMount(async () => {
    redirectUrl = window.location.origin;
    segment = segment;
  });
</script>

<style>
  img {
    width: 60%;
    height: auto;
  }
  .user {
    padding-top: 1.5rem;
  }
  .pagetitle {
    width: 80%;
  }
</style>

<svelte:head>
  <title>Sapindale — Canadiana access platform administration</title>
</svelte:head>

<div>
  <nav>
    <figure>
      <a href="/">
        <img src="/canadiana-logo.svg" alt="img" />
      </a>
    </figure>
    <h1 class="pagetitle">Canadiana access platform administration</h1>

    <div class="user">
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
