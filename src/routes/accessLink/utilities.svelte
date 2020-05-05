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
  .couchview {
    background-color: #1d808b;
    color: white;
    font-size: 1.5em;
    text-align: center;
    padding: 2%;
    width: 30%;
    height: 100px;
  }
  .packaging {
    background-color: #1d808b;
    color: white;
    font-size: 1.5em;
    text-align: center;
    padding: 2%;
    width: 30%;
    height: 100px;
  }
  .futon {
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

  <div class="couchview">
    <a href="/couchview">Couch View Output</a>
  </div>
  <div class="packaging">
    <a
      href="{process.env.PACKAGING}/cookie?token={$authState.token}"
      id="Packaging"
      target="_blank">
      Packaging (legacy tools)
    </a>
  </div>
  <div class="futon">
    <a
      href="{process.env.UPHOLSTERY}/cookie?token={$authState.token}"
      id="Futon"
      target="_blank">
      Futon (Please do not edit unless you know what you are doing)
    </a>
  </div>
</div>
