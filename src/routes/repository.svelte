<script context="module">
  export async function preload(page, session) {
    const repoManage = page.params.merged;
    const response = await this.fetch(`/repository/repository.json`);
    const reporesponse = await response.json();
    if (response.status === 200) {
      return {
        repoManage,
        reporesponse
      };
    } else {
      this.error(response.status, reporesponse.error);
    }
  }
</script>

<script>
  /* import {
    repositoryfilesize,
    repositoryverified,
    repositoryreplicate
  } from "../resources/couch";
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
      var reposize = await repositoryfilesize({
        group_level: 1
      });
    } catch (ignore) {}

    if (Array.isArray(reposize)) {
      var sizetemp = {};
      reposize.forEach(function(arepo) {
        sizetemp[arepo.key[0]] = arepo.value;
      });
      repostats = sizetemp;
      let repovar = Object.keys(repostats);
      repovar.map(async function(repository = "") {
        verified[repository] = {};
        await repositoryverified({
          limit: 1,
          reduce: false,
          startkey: JSON.stringify([repository]),
          endkey: JSON.stringify([repository, {}])
        }).then(async function(rows) {
          if (Array.isArray(rows) && rows.length === 1) {
            verified[repository].earliest = new Date(rows[0].key[1]);
            calculate_human();
          }
          return verified[repository].earliest;
        });

        await repositoryverified({
          limit: 1,
          reduce: false,
          descending: true,
          endkey: JSON.stringify([repository]),
          startkey: JSON.stringify([repository, {}])
        }).then(async function(rows) {
          if (Array.isArray(rows) && rows.length === 1) {
            verified[repository].latest = new Date(rows[0].key[1]);
            calculate_human();
          }
          return verified[repository].latest;
        });

        await repositoryreplicate({
          group_level: 1
        }).then(async function(rows) {
          if (Array.isArray(rows) && rows.length > 0) {
            var temp = {};
            rows.forEach(function(row = {}) {
              temp[row.key[0]] = row.value;
            });
            replicate = temp;
          }
          return replicate;
        });
      });
      Promise.all(repovar).then(function (response) {
      console.log("Inside Promise", response);
    }); 
      merged = {
        ...repostats,
        ...verified
      };
      console.log("Merged", merged);
      return {
        status: 200,
        content: { merged }
      };
    }
  }

  function calculate_human() {
    console.log("repo", repostats);
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
  } */
  export let reporesponse, repoManage;
</script>

<svelte:head>
  <title>Repository</title>
</svelte:head>
<p>{repoManage}{reporesponse}</p>
<!-- {#if repostats}
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
 -->
