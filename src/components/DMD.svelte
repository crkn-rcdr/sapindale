<script>
  import { onMount } from "svelte";
  import { stores } from "@sapper/app";

  const { session } = stores();
  let token = $session.token;

  export let id = undefined;

  // This should eventually be in a common place
  let depositors = [
    {
      id: "ams",
      name: "Shortgrass Public Library System"
    },
    {
      id: "omcn",
      name: "Mississauga Library System"
    },
    {
      id: "oocihm",
      name: "Canadiana.org"
    },
    {
      id: "ooe",
      name: "Department of Foreign Affairs Trade and Development"
    },
    {
      id: "oop",
      name: "Library of Parliament"
    },
    {
      id: "carl",
      name: "Canadian Association of Research Libraries"
    },
    {
      id: "numeris",
      name: "Numeris - broadcast measurement and consumer behaviour data"
    },
    {
      id: "osmsdga",
      name: "South Mountain"
    },
    {
      id: "ooga",
      name: "Canadian Hazards Information Service"
    },
    {
      id: "qmma",
      name: "McGill University Archives"
    }
  ];

  let depositor = "",
    filetype = "",
    metadatafile = undefined,
    metadataname = undefined;

  async function getfile() {
    console.log(this.files);
    if (this.files.length) {
      // Object of type File, which can be used as body: in fetch()
      metadatafile = this.files[0];
      metadataname = metadatafile.name;
    } else {
      metadatafile = undefined;
      metadataname = undefined;
    }
  }
</script>

{#if id}
  ID={id}
{:else}

  <legend>
    Select depositor:
    <select bind:value={depositor}>
      <option value="" />
      {#each depositors as thisdepositor}
        <option value={thisdepositor.id}>{thisdepositor.name}</option>
      {/each}
    </select>
  </legend>

  <legend>
    Select type:
    <select bind:value={filetype}>
      <option value="" />
      <option value="issueinfocsv">Issueinfo CSV</option>
      <option value="dccsv">Dublin Core CSV</option>
      <option value="marc490">MARC - ID in 490</option>
      <option value="marcoocihm">MARC - ID in oocihm interpretation</option>
      <option value="marcooe">MARC - ID in ooe interpretation</option>
    </select>
  </legend>

  <legend>
    Upload file:
    <input type="file" id="upload" name="upload" on:change={getfile} />
  </legend>

  <table>
    <tr>{depositor}</tr>
    <tr>{filetype}</tr>
    <tr>
      {#if metadataname}{metadataname}{/if}
    </tr>
  </table>
{/if}
