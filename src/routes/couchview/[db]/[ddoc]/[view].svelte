<script context="module">
  import qs from "query-string";
  export async function preload(page) {
    const { db, ddoc, view } = page.params;
    const options = page.query;

    function inclusiveArray(key) {
      return key.concat([{}]);
    }
    function inclusiveString(key) {
      return `${key}\uFEFF`;
    }

    function parsedKey(key, inclusive = false) {
      let parsedKey;
      try {
        parsedKey = JSON.parse(key);
      } catch (ignore) {}
      if (Array.isArray(parsedKey)) {
        return inclusive ? inclusiveArray(parsedKey) : parsedKey;
      } else {
        return inclusive ? inclusiveString(key) : key;
      }
    }

    let couchOptions = {
      startkey: options.startkey
        ? JSON.stringify(parsedKey(options.startkey))
        : undefined,
      endkey: options.endkey
        ? JSON.stringify(parsedKey(options.endkey, options.inclusive))
        : undefined,
      reduce: options.reduce,
      group_level: options.reduce ? options.group : undefined,
      limit: options.limit
    };

    return { db, ddoc, view, options, couchOptions };
  }
</script>

<script>
  import { onMount } from "svelte";
  import CouchViewControls from "../../../../components/CouchViewControls.svelte";
  import { state as authState } from "../../../../auth.js";
  import { view as fetchView } from "../../../../couch.js";

  export let db, ddoc, view, options, couchOptions;

  let token = $authState.token;
  let viewContents = [];
  onMount(async () => {
    viewContents = await fetchView(token, db, ddoc, view, couchOptions);
  });
</script>

<style>
  table {
    border-collapse: collapse;
  }

  td,
  th {
    border: 1px solid var(--brand-color);
    padding: 0.5rem;
    text-align: left;
  }
</style>

<svelte:head>
  <title>Sapindale — Couch view output</title>
</svelte:head>

<h1>Couch view output</h1>

<CouchViewControls {db} {ddoc} {view} {options} />

<p>{db}</p>
<p>{ddoc}</p>
<p>{view}</p>
<p>{JSON.stringify(options)}</p>
<p>{JSON.stringify(couchOptions)}</p>

{#if viewContents.length > 0}
  <h2>View output</h2>
  <table>
    <thead>
      <th>Key</th>
      <th>Value</th>
    </thead>
    <tbody>
      {#each viewContents as row}
        <tr>
          <td>{JSON.stringify(row.key)}</td>
          <td>{row.value}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
