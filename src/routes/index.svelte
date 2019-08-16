<script>
  import { state as authState } from "../auth.js";
</script>

<style>
  main {
    float: right;
    padding: 0;
    font-weight: 400;
    margin: 1em;
  }
  h1 {
    padding: 1.5em;
  }
  h2 {
    padding-left: 4em;
  }
  ul {
    padding-left: 4em;
  }
  li {
    font-weight: 400;
    padding-left: 4em;
    list-style-position: inside;
  }
</style>

<main>
  <span>Logged in as: {$authState.name}</span>
</main>
<svelte:head>
  <title>Sapindale — Canadiana access platform administration</title>
</svelte:head>

<h1>Canadiana access platform administration</h1>

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
