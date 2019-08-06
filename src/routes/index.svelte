<script>
  import { state } from "../auth.js";
  var value;
  state.subscribe(updateState => {
    if ($state.status === "SUCCESS") {
      name = $state.name;
      value = $state.token;
    }
  });
</script>

<style>
  p {
    font-weight: bold;
  }
</style>

<svelte:head>
  <title>Sapindale — Canadiana access platform administration</title>
</svelte:head>

<h1>Canadiana access platform administration</h1>

<h2>Tools</h2>
<ul>
  {#if $state.status === 'SUCCESS'}
    <li>
      <a href="/deposit">Deposit from preservation</a>
    </li>
    <li>
      <a href="/collection">Collection manager</a>
    </li>
    <li>
      <a
        href="https://upholstery.canadiana.ca/cookie?token={value}"
        id="Futon"
        target="_blank">
        Futon
      </a>
    </li>
  {:else}
    <p>Please Login to Access More Tools</p>
  {/if}
</ul>
