<script>
  import { onMount } from "svelte";
  import { stores } from "@sapper/app";
  import PrefixSelector from "../util/PrefixSelector.svelte";

  const { session } = stores();
  let token = $session.token;

  export let id = undefined;

  let depositor = undefined,
    mdtype = undefined,
    metadatafile = undefined,
    mdname = undefined,
    mydoc = undefined,
    myattachment = undefined,
    myitems = undefined;

  onMount(async () => {
    await updateLocalFromDoc();
    if (mydoc) {
      depositor = mydoc.depositor;
      mdtype = mydoc.mdtype;
      mdname = mydoc.mdname;
    }
  });

  // `update` is a hash with commands to change the document.
  async function updatedoc(update = {}) {
    const response = await fetch("/dmd.json", {
      method: "POST",
      credentials: "same-origin",
      body: JSON.stringify({
        action: "updatedoc",
        id: id,
        update: update,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    // Currently nothing is done with a response, and only the fact of returning is displayed.
    if (response.status !== 200) {
      console.log("/dmd.json Error", response.status);
    }
  }

  async function updateLocalFromDoc() {
    if (id) {
      const response = await fetch("/dmd.json", {
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify({
          action: "getdoc",
          id: id,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200) {
        console.log("/dmd.json Error getting doc", response.status);
        return;
      }
      let json = await response.json();
      if (!json) {
        return;
      }
      mydoc = json;
      console.log(mydoc);
      myattachment =
        "_attachments" in mydoc && mdname in mydoc._attachments
          ? mydoc._attachments[mdname]
          : undefined;
      myitems = "items" in mydoc ? mydoc.items : undefined;
    } else {
      mydoc = undefined;
      myattachment = undefined;
      myitems = undefined;
    }
  }

  async function checkSetId() {
    if (!id) {
      const response = await fetch("/dmd.json", {
        method: "POST",
        credentials: "same-origin",
        body: JSON.stringify({
          action: "newid",
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200) {
        console.log("/dmd.json Error getting newid", response.status);
        return;
      }
      let json = await response.json();
      if (!json) {
        return;
      }
      if (!"newid" in json) {
        console.log("No new ID?", json);
        return;
      }
      id = json.newid;
      await updateLocalFromDoc(); // load copy of freshy created document.
      history.pushState({ id: history.state.id + 1 }, "", `/dmd/${id}`);
    }
  }

  async function uploadFile() {
    if (this.files.length) {
      // TODO: the server has a maximum file size, which should be checked in client and user alerted rather than generating error.

      await checkSetId();
      // Object of type File, which can be used as body: in fetch()
      metadatafile = this.files[0];

      // Upload to server
      if (!id || !metadatafile) {
        alert("Missing information for upload");
        return;
      }
      const response = await fetch("/dmd.json", {
        method: "PUT",
        credentials: "same-origin",
        body: metadatafile,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/octet-stream",
          "X-Sapindale-ID": id,
        },
      });
      if (response.status !== 200) {
        alert("Problem uploading attachment for " + id);
        return;
      }
      let json = await response.json();
      if (!json) {
        return;
      }
      console.log("upload response", json);
      await updateLocalFromDoc(); // Updates from changes just made
    } else {
      metadatafile = undefined;
      mdname = undefined;
    }
  }

  async function doSplit() {
    await checkSetId();
    await updatedoc({
      split: true,
      mdtype: mdtype,
      depositor: depositor,
    });
    await updateLocalFromDoc();
  }
</script>

<fieldset>
  <legend>Metadata file</legend>

  <legend>
    Select depositor:
    <PrefixSelector bind:prefix={depositor} />
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

  {#if myattachment}
    <table>
      <tr>
        <td>Name</td>
        <td>{mdname}</td>
      </tr>
      <tr>
        <td>Length</td>
        <td>{myattachment.length}</td>
      </tr>
      <tr>
        <td>Content Type</td>
        <td>{myattachment.content_type}</td>
      </tr>
    </table>
  {/if}
  <legend>
    Upload file:
    <input type="file" id="upload" name="upload" on:change={uploadFile} />
  </legend>
  <p>
    <button
      type="submit"
      on:click={() => {
        doSplit();
      }}
    >
      Initiate Split
    </button>
  </p>
</fieldset>

<br />
{#if mydoc && "split" in mydoc}
  <fieldset>
    <legend>Split task</legend>
    <table>
      {#if "requestDate" in mydoc.split}
        <tr>
          <td>Request Date</td>
          <td>{mydoc.split.requestDate}</td>
        </tr>
      {/if}
      {#if "succeeded" in mydoc.split}
        <tr>
          <td>Success?</td>
          <td>{mydoc.split.succeeded ? "Yes" : "No"}</td>
        </tr>
      {/if}
      {#if mydoc.split.message !== ""}
        <tr>
          <td>Message</td>
          <td class="message">{mydoc.split.message}</td>
        </tr>
      {/if}
      {#if "processDate" in mydoc.split}
        <tr>
          <td>Process Date</td>
          <td>{mydoc.split.processDate}</td>
        </tr>
      {/if}
    </table>
  </fieldset>
{/if}
<br />

{#if myitems}
  <fieldset>
    <legend>Metadata records found</legend>
    <table>
      {#each myitems as item}
        <tr>
          <td>{item.id ? item.id : "[not found]"}</td>
          <td>{item.accessidfound ? item.accessidfound : "[not found]"}</td>
          <td>
            {item.preservationidfound
              ? item.preservationidfound
              : "[not found]"}
          </td>
          <td>{item.validated ? "Yes" : "No"}</td>
          <td>{item.message ? item.message : ""}</td>
          <td>{item.pubmin ? item.pubmin : ""}</td>
          <td>{item.pubmax ? item.pubmax : ""}</td>
          <td>Copy2access</td>
          <td>copy2preservation</td>
        </tr>
      {/each}
    </table>
  </fieldset>
{/if}
<table>
  {#if depositor}
    <tr>
      <td>Depositor</td>
      <td>{depositor}</td>
    </tr>
  {/if}
  {#if mdtype}
    <tr>
      <td>Metadata type</td>
      <td>{mdtype}</td>
    </tr>
  {/if}
  {#if mydoc && mydoc._rev}
    <tr>
      <td>Revision</td>
      <td>{mydoc._rev}</td>
    </tr>
  {/if}
</table>

<style>
  td.message {
    word-wrap: break-word;
  }
</style>
