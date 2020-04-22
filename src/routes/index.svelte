<script>
  import { state as authState } from "../auth.js";
</script>

<style>
  .navigate {
    padding-top: 20%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: space-between;
  }
  .accCollection {
    background-color: #1d808b;
    color: white;
    font-size: 1.5em;
    text-align: center;
    padding: 2%;
    width: 30%;
    height: 100px;
  }
  .accManifest {
    background-color: #1d808b;
    color: white;
    font-size: 1.5em;
    text-align: center;
    padding: 2%;
    width: 30%;
    height: 100px;
  }
  .utilities {
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
  <div class="accCollection">
    <a href="/accessLink/accessCollection">Access Collections</a>
  </div>
  <div class="accManifest">
    <a href="/accessLink/accessManifest">Access Manifests</a>
  </div>
  <div class="utilities">
    <a href="/accessLink/utilities">Utilities</a>
  </div>
</div>
