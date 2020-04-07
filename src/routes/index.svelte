<script>
  import { state as authState } from "../auth.js";
</script>

<style>

</style>

<svelte:head>
  <title>Sapindale — Canadiana access platform administration</title>
</svelte:head>

<div class="flex flex-horizontal-center pt-48 h-28">
  <div
    class="flex-1 text-white text-center text-xl bg-primary pt-8 py-2 m-2 h-24
    max-w-full mx-auto hover:border-black-600">
    <a href="/accessLink/accessCollection">Access Collections</a>
  </div>

  <div
    class="flex-1 text-white text-center bg-primary text-xl pt-8 py-2 m-2 h-24">
    <a href="/accessLink/accessManifest">Access Manifests</a>
  </div>
  <div
    class="flex-1 text-white text-center text-xl bg-primary pt-8 py-2 m-2 h-24">
    <a href="/accessLink/utilities">Utilities</a>
  </div>
</div>
