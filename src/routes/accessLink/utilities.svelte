<script>
  import { state as authState } from "../../auth.js";
</script>

<style>

</style>

<svelte:head>
  <title>Sapindale — Canadiana access platform administration</title>
</svelte:head>
<div class="mx-auto">
  <div class="flex flex-horizontal-center pt-48 h-28">
    <div
      class="flex-1 text-white text-center text-xl bg-primary pt-8 py-2 m-2 h-24
      hover:border-black-600">
      <a href="/couchview">Couch View Output</a>
    </div>
    <div
      class="flex-1 text-white text-center text-xl bg-primary pt-8 py-2 m-2 h-24
      hover:border-black-600">
      <a
        href="{process.env.UPHOLSTERY}/cookie?redirect=/demo/&token={$authState.token}"
        id="Packaging"
        target="_blank">
        Packaging (legacy tools)
      </a>
    </div>
    <div
      class="flex-1 text-white text-center text-xl bg-primary pt-8 py-2 m-2 h-24
      hover:border-black-600">
      <a
        href="{process.env.UPHOLSTERY}/cookie?redirect=/couch/_utils/&token={$authState.token}"
        id="Futon"
        target="_blank">
        Futon (Please do not edit unless you know what you are doing)
      </a>
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
