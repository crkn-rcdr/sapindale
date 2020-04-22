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
  .deposit {
    background-color: #1d808b;
    color: white;
    font-size: 1.5em;
    text-align: center;
    padding: 2%;
    width: 30%;
    height: 100px;
  }
  .createManifest {
    background-color: #1d808b;
    color: white;
    font-size: 1.5em;
    text-align: center;
    padding: 2%;
    width: 30%;
    height: 100px;
  }
  .editManifest {
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

  <div class="deposit">
    <a href="/deposit">Deposit From Preservation</a>
  </div>
  <div class="createManifest">
    <a href="/createManifest">Create New Manifest</a>
  </div>
  <div class="editManifest">
    <a href="/manifest/m0bc1df2gh3jk">Edit Manifest</a>
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
