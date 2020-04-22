<script>
  import { state as authState } from "../../auth.js";
</script>

<style>
  .navigate {
    padding-top: 20%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-content: space-between;
  }
  .createCollection {
    background-color: #1d808b;
    color: white;
    font-size: 1.5em;
    text-align: center;
    padding: 2%;
    width: 30%;
    height: 100px;
  }
  .editCollection {
    background-color: #1d808b;
    color: white;
    font-size: 1.5em;
    text-align: center;
    padding: 2%;
    width: 30%;
    height: 100px;
  }
</style>

<svelte:head>
  <title>Sapindale — Canadiana access platform administration</title>
</svelte:head>
<div class="navigate">
  <div class="createCollection">
    <a href="/collection/[slug].svelte">Create New Collection</a>
  </div>
  <div class="editCollection">
    <a href="/collection">Edit Collection</a>
  </div>
</div>
<!-- <div class="flex flex-horizontal-center pt-20 pl-2">
  <a
    class=" inline-block border border-primary rounded py-1 px-3 bg-primary
    text-white"
    href="/">
    Back
  </a>
</div> -->
