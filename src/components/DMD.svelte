<script>
  import { onMount } from "svelte";
  import { stores } from "@sapper/app";
  import { newid, updatedoc, getdoc } from "../couch/dmdtask.js";

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

  let depositor = undefined,
    mdtype = undefined,
    metadatafile = undefined,
    mdname = undefined;

  onMount(async () => {
    if (id) {
      let thisdoc = {};
      try {
        thisdoc = await getdoc(token, id);
      } catch (ignore) {}
      console.log(thisdoc);
      if ("depositor" in thisdoc) {
        depositor = thisdoc.depositor;
      }
      if ("mdtype" in thisdoc) {
        mdtype = thisdoc.mdtype;
      }
      if ("mdname" in thisdoc) {
        mdname = thisdoc.mdname;
      }
    }
  });

  async function getfile() {
    console.log(this.files);
    if (this.files.length) {
      // Object of type File, which can be used as body: in fetch()
      metadatafile = this.files[0];
      mdname = metadatafile.name;
    } else {
      metadatafile = undefined;
      mdname = undefined;
    }
  }

  async function updateTask() {
    if (!id) {
      id = await newid(token);

      history.pushState({ id: history.state.id + 1 }, "", `/dmd/${id}`);
    }
    console.log(
      await updatedoc(token, id, {
        depositor: depositor === "" ? undefined : depositor,
        mdtype: mdtype === "" ? undefined : mdtype,
        mdname: mdname
      })
    );
  }
</script>

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
  <select bind:value={mdtype}>
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

<button
  type="submit"
  on:click={() => {
    updateTask();
  }}>
  {#if id}Update{:else}Create{/if}
</button>
<br />
<br />
<table>
  <tr>
    {#if id}{id}{/if}
  </tr>
  <tr>
    {#if depositor}{depositor}{/if}
  </tr>
  <tr>
    {#if mdtype}{mdtype}{/if}
  </tr>
  <tr>
    {#if mdname}{mdname}{/if}
  </tr>
</table>
