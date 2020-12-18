<script context="module">
  export async function preload(page, session) {
    const { name } = session;
    return { name };
  }
</script>

<script>
  import { logoutUrl } from "../resources/auth";
  export let name;
</script>

<style>
  .brand {
    display: block;
  }
  .brand img {
    vertical-align: middle;
  }
</style>

<svelte:head>
  <title>Sapindale — Canadiana platform administration</title>
</svelte:head>

<nav>
  <a href="/" class="brand">
    <img
      src="/canadiana-logo.svg"
      height="48"
      width="48"
      alt="Canadiana Logo" />
    Canadiana Platform Administration
  </a>
  <ul>
    <li>
      Logged in as: {name}.
      <a href={logoutUrl}>Log out</a>
    </li>
  </ul>
</nav>
<main>
  <slot />
</main>
