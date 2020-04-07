<script>
  import { state as authState } from "../../auth.js";
</script>

<style>

</style>

<svelte:head>
  <title>Sapindale — Canadiana access platform administration</title>
</svelte:head>
<div>
  <div class="flex flex-horizontal-center pt-48 h-28">
    <div
      class="flex-1 text-white text-center text-xl bg-primary pt-8 py-2 m-2 h-24
      hover:border-black-600">
      <a href="/deposit">Deposit From Preservation</a>
    </div>
    <div
      class="flex-1 text-white text-center text-xl bg-primary pt-8 py-2 m-2 h-24
      hover:border-black-600">
      <a href="/createManifest">Create New Manifest</a>
    </div>
    <div
      class="flex-1 text-white text-center text-xl bg-primary pt-8 py-2 m-2 h-24
      hover:border-black-600">
      <a href="/manifest/m0bc1df2gh3jk">Edit Manifest</a>
    </div>
  </div>
</div>
<div class="flex flex-horizontal-center pt-20 pl-2">
  <a
    class=" inline-block border border-primary rounded py-1 px-3 bg-primary
    text-white"
    href="/">
    Back
  </a>
</div>
