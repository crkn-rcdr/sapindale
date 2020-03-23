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

<div class="max-w-6xl mx-auto pt-8">
  <nav class="flex content-start flex-wrap text-right">
    <figure class="flex content-start flex-wrap">
      <img
        class="object-scale-down h-50 w-20"
        src="/canadiana-logo.svg"
        alt="img" />
      <h1 class="text-right text-black pl-20 pt-4">
        Canadiana access platform administration
      </h1>
    </figure>
    <!-- <a
      class=" inline-block border border-red-500 rounded py-1 px-3 bg-red-500
      text-white"
      href="/">
      Home
    </a> -->
    <div class="pl-20 pt-8">
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
      <!-- <h1>Canadiana access platform administration</h1> -->
      <p
        class="flex-1 text-white text-center text-xl bg-primary pt-8 py-2 m-2
        h-24">
        Please log in to continue.
      </p>
    {/if}
  </main>
</div>
