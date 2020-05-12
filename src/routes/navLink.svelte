<script>
  import { state as authState } from "../auth.js";
  import navList from "./navList.svelte";
</script>

<style>
  li {
    display: flex;
    list-style: none;
    padding: 0.25rem;
    font-size: 1.25rem;
  }
</style>

<navList>

  <li>
    <a href="/deposit">Deposit From Preservation</a>
  </li>
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

</navList>
