<script>
  import { state as authState } from "../auth.js";
</script>

<style>
  main {
    float: right;
    padding: 0;
    font-weight: 300;
    margin: 1em;
  }
  h1 {
    padding: 1.5em;
    position: relative;
  }
</style>

<main>
  <span>Logged in as: {$authState.name}</span>
</main>
<svelte:head>
  <title>Sapindale — Canadiana access platform administration</title>
</svelte:head>

<h1>Canadiana access platform administration</h1>

{#if $authState.status === 'SUCCESS'}
  <h2>Tools</h2>
  <ul>
    <li>
      <a href="/deposit">Deposit from preservation</a>
    </li>
    <li>
      <a href="/collection">Collection manager</a>
    </li>
    <li>
      <a
        href="{process.env.COUCH}/cookie?token={$authState.token}"
        id="Futon"
        target="_blank">
        Futon
      </a>
    </li>
    <li>
      <a href="/coltitles">Collection titles</a>
    </li>
  </ul>
{:else}
  <p>Please login (using the link above) to access administration tools.</p>
{/if}
