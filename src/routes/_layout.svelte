<script>
  import { state as authState } from "../auth.js";
  import { onMount } from "svelte";
  let redirectUrl = undefined;

  onMount(async () => {
    redirectUrl = window.location.origin;
  });
</script>

<style>
  .brand {
    display: block;
  }
  .brand img {
    height: 48px;
    width: 48px;
    vertical-align: middle;
  }
</style>

<svelte:head>
  <title>Sapindale — Canadiana platform administration</title>
</svelte:head>

<nav>
  <a href="/" class="brand">
    <img src="/canadiana-logo.svg" alt="Canadiana Logo" />
    Canadiana Platform Administration
  </a>
  <ul>
    <li>
      {#if $authState.status === 'SUCCESS'}
        Logged in as: {$authState.name}
      {:else if $authState.status === 'FAILED'}
        <a
          href="https://auth.canadiana.ca/1/azuread/login?redirectUrl={redirectUrl}">
          Login
        </a>
      {/if}
    </li>
  </ul>
</nav>
<main>
  {#if $authState.status === 'SUCCESS'}
    <slot />
  {:else}
    <p class="text-white text-center text-xl bg-primary pt-8 py-2 m-2 h-24">
      <a
        href="https://auth.canadiana.ca/1/azuread/login?redirectUrl={redirectUrl}">
        Please log in to continue.
      </a>
    </p>
  {/if}
</main>
