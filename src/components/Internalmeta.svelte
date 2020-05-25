<script>
  // This should eventually be in a common place
  export let depositors = [
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
    ],
    depositor = "",
    hidefinder = false,
    findidentifiers = "";
</script>

<style>
  fieldset {
    border: 2px solid black;
    padding: 5px;
  }
  textarea {
    width: 100%;
    height: 100px;
  }
</style>

<h1>Internalmeta (legacy access)</h1>

<fieldset>
  <legend>
    (
    <label for="hidefinder">
      <input type="checkbox" id="hidefinder" bind:checked={hidefinder} />
      Hide?
    </label>
    ) Select depositor:
    <select bind:value={depositor}>
      <option value="" />
      {#each depositors as thisdepositor}
        <option value={thisdepositor.id}>{thisdepositor.name}</option>
      {/each}
    </select>
    {#if depositor !== ''}({depositor}){/if}

  </legend>
  {#if !hidefinder}
    <textarea id="identifiers" bind:value={findidentifiers} />
  {/if}

</fieldset>
