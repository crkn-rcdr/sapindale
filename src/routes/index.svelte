<script>
  import { state as authState } from "../auth.js";

  let legacy = false;
</script>

<style>
  section header label {
    max-width: unset;
  }

  section aside ul {
    list-style: none;
    padding-inline-start: 0;
  }

  section aside ul li {
    padding-left: 0;
  }
</style>

<svelte:head>
  <title>Sapindale — Canadiana platform administration</title>
</svelte:head>

<section>
  <header>
    <h1>Canadiana platform administration</h1>
    <label for="legacy">
      <input type="checkbox" bind:checked={legacy} id="legacy" />
      Show legacy tools
    </label>
  </header>

  <aside>
    <h2>Packaging</h2>
    <ul>
      {#if legacy}
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
            href="{process.env.UPHOLSTERY}/cookie?redirect=/demo/validationStatisticsTool.html&token={$authState.token}"
            target="_blank">
            Legacy Repository Statistics
          </a>
        </li>
      {:else}
        <li>
          <a href="/packaging">Packaging (combined tool)</a>
        </li>
        <li>
          <a href="/repository">Repository statistics</a>
        </li>
      {/if}
    </ul>
  </aside>

  <aside>
    <h2>Access (pre-split)</h2>
    <ul>
      {#if legacy}
        <li>
          <a
            href="{process.env.UPHOLSTERY}/cookie?redirect=/demo/collectionManage.html&token={$authState.token}"
            target="_blank">
            Legacy Application Platform Collection Manager
          </a>
        </li>
      {:else}
        <li>
          <a href="/internalmeta">Approval and collection tagging</a>
        </li>
      {/if}
    </ul>
  </aside>

  <aside>
    <h2>Access (post-split)</h2>
    <ul>
      <li>
        <a href="/archivalmanifest">Archival Manifest</a>
      </li>
    </ul>
  </aside>

  <aside>
    <h2>Utilities</h2>
    <ul>
      <li>
        <a href="/couchview">CouchView</a>
      </li>
      {#if legacy}
        <li>
          <a
            href="{process.env.UPHOLSTERY}/cookie?redirect=/demo/FD.html&token={$authState.token}"
            target="_blank">
            Find Duplicates (Legacy)
          </a>
        </li>
      {:else}
        <li>
          <a href="/findduplicates">Find Duplicates</a>
        </li>
      {/if}
      <li>
        <a
          href="{process.env.UPHOLSTERY}/cookie?token={$authState.token}"
          id="Futon"
          target="_blank"
          style="color: red">
          Futon (Please do not edit unless you know what you are doing)
        </a>
      </li>
    </ul>
  </aside>
</section>
