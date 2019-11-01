<script>

  import { state as authState } from "../auth.js";
</script>

<style>
.leading-relaxed {
    height: 3em;
  }
</style>

<svelte:head>
  <title>Sapindale — Canadiana access platform administration</title>
</svelte:head>

<h1 class="leading-relaxed text-2xl">Canadiana access platform administration</h1>

<h2 class="leading-relaxed text-xl">Tools</h2>
<ul class="list-inside list-disc">
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
    <a href="/couchview">Couch view output</a>
  </li>
</ul>
