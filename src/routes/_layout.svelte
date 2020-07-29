<script context="module">
  export async function preload(page, session) {
    const { authenticated, name, email } = session;
    if (authenticated) {
      return { authenticated, name, email };
    } else {
      const redirectUrl = page.toString();
      return { redirectUrl, authenticated: false };
    }
  }
</script>

<script>
  export let authenticated, redirectUrl, name;
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
      {#if authenticated}
        Logged in as: {name}
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
  {#if authenticated}
    <slot />
  {:else}
    <p>
      <a
        href="https://auth.canadiana.ca/1/azuread/login?redirectUrl={redirectUrl}">
        Please log in to continue.
      </a>
    </p>
  {/if}
</main>
