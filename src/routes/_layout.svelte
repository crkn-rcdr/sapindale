<script>
  import { state as authState } from "../auth.js";
  import { onMount } from "svelte";
  var redirectUrl;

  onMount(async () => {
    redirectUrl = window.location.origin;
  });
</script>

<style>
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    max-width: 100vw;
  }

  ul::after {
    content: "";
    display: block;
    clear: both;
  }

  nav li {
    padding: 2ch;
    float: left;
  }

  nav li.login {
    float: right;
  }

  main {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>

<svelte:head>
  <title>Sapindale — Canadiana access platform administration</title>
</svelte:head>

<nav>
  <ul>
    <li>
      <a href="/">Home</a>
    </li>
    <li class="login">
      {#if $authState.status === 'SUCCESS'}
        Logged in as: {$authState.name}
      {:else}
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
    <h1>Canadiana access platform administration</h1>
    <p>Please log in to continue.</p>
  {/if}
</main>
