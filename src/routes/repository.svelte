<script>
  import {
    repositoryfilesize,
    repositoryverified,
    repositoryreplicate
  } from "../couch/repository";
  import { onMount } from "svelte";
  import { stores } from "@sapper/app";

  var filesize = require("filesize");

  const { session } = stores();
  let token = $session.token;

  export let repostats = undefined,
    verified = {},
    replicate = undefined;

  onMount(async () => {
    refreshValues();
  });

  async function refreshValues() {
    var reposize = undefined;
    try {
      var reposize = await repositoryfilesize(token, {
        group_level: 1
      });
    } catch (ignore) {}

    if (Array.isArray(reposize)) {
      var sizetemp = {};
      reposize.forEach(function(arepo) {
        sizetemp[arepo.key[0]] = arepo.value;
      });
      repostats = sizetemp;

      Object.keys(repostats).forEach(function(repository = "") {
        verified[repository] = {};
        repositoryverified(token, {
          limit: 1,
          reduce: false,
          startkey: JSON.stringify([repository]),
          endkey: JSON.stringify([repository, {}])
        }).then(function(rows) {
          if (Array.isArray(rows) && rows.length === 1) {
            verified[repository].earliest = new Date(rows[0].key[1]);
            calculate_human();
          }
        });

        repositoryverified(token, {
          limit: 1,
          reduce: false,
          descending: true,
          endkey: JSON.stringify([repository]),
          startkey: JSON.stringify([repository, {}])
        }).then(function(rows) {
          if (Array.isArray(rows) && rows.length === 1) {
            verified[repository].latest = new Date(rows[0].key[1]);
            calculate_human();
          }
        });
      });

      repositoryreplicate(token, {
        group_level: 1
      }).then(function(rows) {
        if (Array.isArray(rows) && rows.length > 0) {
          var temp = {};
          rows.forEach(function(row = {}) {
            temp[row.key[0]] = row.value;
          });
          replicate = temp;
        }
      });
    }
  }

  function calculate_human() {
    Object.keys(repostats).forEach(function(repository = "") {
      if (
        "earliest" in verified[repository] &&
        "latest" in verified[repository] &&
        !("human" in verified[repository])
      ) {
        var d1 = verified[repository].latest - verified[repository].earliest;

        var diffDays = parseInt(d1 / (1000 * 60 * 60 * 24));
        var months = Math.floor(diffDays / 30);
        var days = diffDays - months * 30;

        var mydate = new Date(d1);
        verified[repository].human =
          months +
          " months, " +
          days +
          " days, " +
          mydate.getUTCHours() +
          " hours, " +
          mydate.getUTCMinutes() +
          " minutes and " +
          mydate.getUTCSeconds() +
          " second(s)";
      }
    });
  }
</script>

<svelte:head>
  <title>Repository</title>
</svelte:head>

{#if repostats}
  <button
    on:click={() => {
      refreshValues();
    }}>
    Refresh
  </button>

  <table>
    <tr>
      <th>Repository</th>
      {#each Object.keys(repostats) as repository}
        <th>{repository}</th>
      {/each}
    </tr>

    <tr>
      <th>AIP count</th>
      {#each Object.keys(repostats) as repository}
        <td>{repostats[repository].count}</td>
      {/each}
    </tr>

    <tr>
      <th>Total disk used</th>
      {#each Object.keys(repostats) as repository}
        <td>
          {repostats[repository].sum} ({filesize(repostats[repository].sum)})
        </td>
      {/each}
    </tr>

    <tr>
      <th>Earliest validated</th>
      {#each Object.keys(repostats) as repository}
        <td>
          {#if verified[repository] && verified[repository].earliest}
            {verified[repository].earliest}
          {/if}
        </td>
      {/each}
    </tr>

    <tr>
      <th>Latest validated</th>
      {#each Object.keys(repostats) as repository}
        <td>
          {#if verified[repository] && verified[repository].latest}
            {verified[repository].latest}
          {/if}
        </td>
      {/each}
    </tr>

    <tr>
      <th>Differance (human readable)</th>
      {#each Object.keys(repostats) as repository}
        <td>
          {#if verified[repository] && verified[repository].human}
            {verified[repository].human}
          {/if}
        </td>
      {/each}
    </tr>

    {#if replicate}
      <tr>
        <th>Replication queue length</th>
        {#each Object.keys(repostats) as repository}
          <td>
            {#if replicate[repository]}{replicate[repository]}{/if}
          </td>
        {/each}
      </tr>
    {/if}

  </table>
{:else}Loading repository statistics...{/if}
