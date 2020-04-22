<script>
  import { state as authState } from "../auth.js";
  import { onMount } from "svelte";
  let redirectUrl = undefined;

  onMount(async () => {
    redirectUrl = window.location.origin;
  });
</script>

<style>
  img {
    width: 100%;
    height: auto;
  }
  .user {
    padding-top: 1.5rem;
  }
  .pagetitle {
    width: calc(100% + 100px);
  }
</style>

<svelte:head>
  <title>Sapindale — Canadiana access platform administration</title>
</svelte:head>

<div>
  <nav>
    <!-- <div> -->
    <figure>
      <img src="/canadiana-logo.svg" alt="img" />
      <!-- <h1>Canadiana access platform administration</h1> -->
    </figure>
    <h1 class="pagetitle">Canadiana access platform administration</h1>
    <!--  </div> -->
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
