<script context="module">
  export async function preload(page, session) {
    const { authenticated, name, email, redirectUrl } = session;
    if (authenticated) {
      return { authenticated, name, email };
    } else {
      return { redirectUrl, authenticated: false };
    }
  }
</script>

<script>
  export let authenticated, redirectUrl, name;
  let loginUrl = `https://auth.canadiana.ca/azuread/login?redirectUrl=${redirectUrl}`;
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
      {#if authenticated}
        Logged in as: {name}
      {:else}
        <a href={loginUrl}>Login</a>
      {/if}
    </li>
  </ul>
</nav>
<main>
  {#if authenticated}
    <slot />
  {:else}
    <p>
      <a href={loginUrl}>Please log in to continue.</a>
    </p>
  {/if}
</main>
