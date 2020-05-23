<script>
  import { state as authState } from "../auth.js";

  let tool = { clicked: false };
  function legacyTools() {
    tool.clicked = !tool.clicked;
  }
</script>

<style>
  .contain {
    padding-top: 5%;
  }
  li {
    display: flex;
    list-style: none;
    padding: 0.25rem;
    font-size: 1.25rem;
    cursor: pointer;
  }
  .innerList {
    padding-left: 2.5%;
  }
</style>

<svelte:head>
  <title>Sapindale — Canadiana access platform administration</title>
</svelte:head>
<div class="contain">
  <ul>
    <li>
      <a href="/couchview">CouchView</a>
    </li>
    <li on:click={legacyTools}>Legacy Tools (run on Upholstery)</li>
    {#if tool.clicked}
      <ul class="innerList">
        <li>
          <a
            href="{process.env.UPHOLSTERY}/cookie?redirect=/demo/wipFindMoveCreate.html&token={$authState.token}"
            target="_blank">
            WIP Find/Move/Create
          </a>
        </li>
        <li>
          <a
            href="{process.env.UPHOLSTERY}/cookie?redirect=/demo/wipProcessStatus.html&token={$authState.token}"
            target="_blank">
            WIP Process Status
          </a>
        </li>
        <li>
          <a
            href="{process.env.UPHOLSTERY}/cookie?redirect=/demo/wipStartProcess.html&token={$authState.token}"
            target="_blank">
            WIP Start Process
          </a>
        </li>
        <li>
          <a
            href="{process.env.UPHOLSTERY}/cookie?redirect=/demo/collectionManage.html&token={$authState.token}"
            target="_blank">
            Legacy Application Platform Collection Manager
          </a>
        </li>
        <li>
          <a
            href="{process.env.UPHOLSTERY}/cookie?redirect=/demo/validationStatisticsTool.html&token={$authState.token}"
            target="_blank">
            Legacy Repository Statistics
          </a>
        </li>
        <li>
          <a
            href="{process.env.UPHOLSTERY}/cookie?redirect=/demo/FD.html&token={$authState.token}"
            target="_blank">
            Find Duplicates in list
          </a>
        </li>
      </ul>
    {/if}
    <li>
      <a
        href="{process.env.UPHOLSTERY}/cookie?token={$authState.token}"
        id="Futon"
        target="_blank">
        Futon (Please do not edit unless you know what you are doing)
      </a>
    </li>
  </ul>
  <h2>In development/demos</h2>
  <ul>
    <li>
      <a href="/packaging">
        Packaging (to replace all 3 older packaging tools)
      </a>
    </li>
    <li>
      <a href="/findduplicates">Find Duplicates (to replace old FD tool)</a>
    </li>
    <li>
      <a href="/internalmeta">
        Internalmeta (to replace legacy approve,collection tagging, internalmeta
        csv)
      </a>
    </li>
  </ul>
</div>
