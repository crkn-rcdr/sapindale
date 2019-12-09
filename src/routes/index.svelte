<script>
  import { state as authState } from "../auth.js";
</script>

<svelte:head>
  <title>Sapindale — Canadiana access platform administration</title>
</svelte:head>
<div class="mx-auto">
  <h1>Canadiana access platform administration</h1>

  <h2>Tools</h2>
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
    <li>
      <a href="/manifestview">Manifest editor</a>
    </li>
  </ul>
</div>
