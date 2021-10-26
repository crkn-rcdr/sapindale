<script>
  // import { stores } from "@sapper/app";
  // const { session } = stores();
  // let legacy = false;
  import SlugSelector from "../components/Index/SlugSelector.svelte";
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
        <a href="https://access.canadiana.ca/">Access platform administration</a>
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
    </ul>
  </aside>
</section>
