<script>
  import { state as authState } from "../auth.js";

  let legacy = false;
</script>

<style>
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
  </header>

  <aside>
    <h2>Packaging</h2>
    <ul>
      <li>
        <a href="/packaging">Packaging (combined tool)</a>
      </li>
      <li>
        <a href="/repository">Repository statistics</a>
      </li>
    </ul>
  </aside>

  <aside>
    <h2>Access (pre-split)</h2>
    <ul>
      <li>
        <a href="/internalmeta">Approval and collection tagging</a>
      </li>
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
      <li>
        <a href="/findduplicates">Find Duplicates</a>
      </li>
      <li>
        <a
          href="{process.env.UPHOLSTERY}/cookie?token={$authState.token}"
          id="Futon"
          target="_blank"
          class="danger">
          Futon (Please do not edit unless you know what you are doing)
        </a>
      </li>
    </ul>
  </aside>
</section>
