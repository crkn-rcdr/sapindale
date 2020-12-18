<script>
  import { stores } from "@sapper/app";
  import {
    dipstagingdatabase,
    dipstagingdocs,
    smeltstatusview,
    manifestdateview,
    smeltqview,
    updatebasic
  } from "../couch/dipstaging.js";
  import TypeAhead from "../components/Couch/TypeAhead";
  import SlugResolver from "../components/Slug/Resolver";
  import { depositors } from "../commonvars";
  const { session } = stores();
  let token = $session.token;

  const statuslimit = 1000;

  let depositor = "",
    whichgroup = "",
    hidegroup = false,
    what = "d",
    findidentifiers = "",
    selectedIDs = [],
    findnotfound = [],
    hidenotfound = false,
    docs = [],
    hidedocs = false,
    selected = {},
    slugs = {},
    smeltstatus = undefined,
    statustype = "f",
    statuslevel = "3",
    mdate = undefined,
    mdatekey = [],
    sdate = undefined,
    sdatekey = [],
    showmessage = true,
    showdetails = true,
    processindication = undefined;

  async function loadgroup() {
    docs = [];
    mdate = undefined;
    sdate = undefined;
    smeltstatus = undefined;
    processindication = undefined;
    switch (whichgroup) {
      case "status":
        var start = undefined;
        var end = undefined;
        if (statustype !== "b") {
          var truthiness = statustype === "s";
          start = JSON.stringify([truthiness, {}]);
          end = JSON.stringify([truthiness]);
        }
        try {
          smeltstatus = await smeltstatusview(token, {
            group_level: parseInt(statuslevel),
            startkey: start,
            endkey: end,
            descending: true
          });
        } catch (ignore) {
          return;
        }
        break;
      case "date":
        var start = undefined;
        var end = undefined;
        if (mdatekey.length > 0) {
          end = JSON.stringify(mdatekey);
          var startdate = JSON.parse(JSON.stringify(mdatekey));
          startdate.push({});
          start = JSON.stringify(startdate);
        }
        try {
          mdate = await manifestdateview(token, {
            group_level: mdatekey.length + 1,
            descending: true,
            startkey: start,
            endkey: end
          });
        } catch (ignore) {
          return;
        }
        break;
      case "smelt":
        var start = undefined;
        var end = undefined;
        if (sdatekey.length > 0) {
          end = JSON.stringify(sdatekey);
          var startdate = JSON.parse(JSON.stringify(sdatekey));
          startdate.push({});
          start = JSON.stringify(startdate);
        }
        try {
          sdate = await smeltqview(token, {
            group_level: sdatekey.length + 1,
            descending: true,
            startkey: start,
            endkey: end
          });
        } catch (ignore) {
          return;
        }
        break;
      case "find":
        break;
      default:
        break;
    }
  }

  async function viewStatus(key = []) {
    // I haven't yet found a better way to copy the array...
    var endkey = JSON.parse(JSON.stringify(key));
    endkey.push({});

    acceptDocs(
      await smeltstatusview(token, {
        reduce: false,
        include_docs: true,
        startkey: JSON.stringify(key),
        endkey: JSON.stringify(endkey),
        limit: statuslimit
      })
    );
  }

  async function viewDate(key = []) {
    // I haven't yet found a better way to copy the array...
    var endkey = JSON.parse(JSON.stringify(key));
    endkey.push({});

    acceptDocs(
      await manifestdateview(token, {
        reduce: false,
        include_docs: true,
        startkey: JSON.stringify(key),
        endkey: JSON.stringify(endkey)
      })
    );
  }

  async function viewSmelt(key = []) {
    // I haven't yet found a better way to copy the array...
    var endkey = JSON.parse(JSON.stringify(key));
    endkey.push({});

    acceptDocs(
      await smeltqview(token, {
        reduce: false,
        include_docs: true,
        startkey: JSON.stringify(key),
        endkey: JSON.stringify(endkey)
      })
    );
  }

  async function viewFind() {
    findidentifiers.replace(/["]/g, "");
    var IDs = findidentifiers.split(/[,|\s]/);
    var IDlist = [];

    for (var index in IDs) {
      var currentID = IDs[index];
      if (/\S/.test(currentID)) {
        if (depositor !== "" && currentID.indexOf(".") === -1) {
          currentID = depositor + "." + currentID;
        }
        IDlist.push(currentID);
      }
    }

    acceptDocs(await dipstagingdocs(token, IDlist, { include_docs: true }));
  }

  function acceptDocs(mydocs = []) {
    if (!Array.isArray(mydocs)) {
      // TODO: Do something better for this error condition
      return;
    }
    var tempdocs = [];
    var tempnotfound = [];

    // reset to defaults
    selected = {};
    slugs = {};

    mydocs.forEach(function(doc) {
      if ("doc" in doc) {
        selected[doc.doc._id] = false;
        if ("slug" in doc.doc) {
          slugs[doc.doc._id] = doc.doc.slug;
        } else {
          slugs[doc.doc._id] = doc.doc._id;
        }
        tempdocs.push(doc.doc);
      } else {
        tempnotfound.push(doc.key);
      }
    });
    findnotfound = tempnotfound;
    docs = tempdocs;
    updateSelectedIDs();
  }

  function selectAll() {
    Object.keys(selected).forEach(function(key) {
      selected[key] = true;
    });
    updateSelectedIDs();
    docs = docs;
  }

  function unselectAll() {
    Object.keys(selected).forEach(function(key) {
      selected[key] = false;
    });
    updateSelectedIDs();
    docs = docs;
  }

  function updateSelectedIDs() {
    var tempids = [];
    Object.keys(selected).forEach(function(key) {
      if (selected[key] === true) {
        tempids.push(key);
      }
    });
    selectedIDs = tempids;
    processindication = undefined;
  }

  async function doAction(type = "") {
    console.log("doAction");

    var updates = {};

    for (const id of selectedIDs) {
      if (type === "clear") {
        updates[id] = {
          smelt: "{}"
        };
      } else {
        updates[id] = {
          dosmelt: true,
          slug: slugs[id]
        };
      }
    }

    processindication = {
      start: true,
      type: type,
      aips: selectedIDs.length
    };

    await updatebasic(token, selectedIDs, updates);

    processindication = {
      start: false,
      type: type,
      aips: selectedIDs.length
    };
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function findaddselect(event) {
    var findaddid = event.detail.value;
    findidentifiers = findidentifiers.concat("\n", findaddid);
  }
</script>

<style>
  li.slug {
    display: inline-list-item;
  }
</style>

<svelte:head>
  <title>Archival Manifests</title>
</svelte:head>

<h1>Archival Manifest</h1>

<fieldset>
  <legend>
    (
    <label for="hidegroup">
      <input type="checkbox" id="hidegroup" bind:checked={hidegroup} />
      Hide?
    </label>
    ) Choose which group of AIPs from
    <select bind:value={whichgroup} on:blur={loadgroup}>
      <option value="">(please pick)</option>
      <option value="date">packaging date</option>
      <option value="smelt">processing queue</option>
      <option value="status">processing status</option>
      <option value="find">a list I supply</option>
    </select>
    and
    <select bind:value={what}>
      <option value="d">display details</option>
      <option value="l">display list</option>
    </select>
  </legend>
  {#if !hidegroup}
    {#if whichgroup === 'find'}
      Select depositor:
      <select bind:value={depositor}>
        <option value="" />
        {#each depositors as thisdepositor}
          <option value={thisdepositor.id}>{thisdepositor.name}</option>
        {/each}
      </select>
      {#if depositor !== ''}({depositor}){/if}

      <div class="label">
        <TypeAhead
          db={dipstagingdatabase}
          id="findadd"
          label="Input an AIP ID to add to find box:"
          on:selected={findaddselect} />
      </div>
      Or past ID's directly into box:
      <textarea id="identifiers" bind:value={findidentifiers} />

      <button
        type="submit"
        on:click={() => {
          viewFind();
        }}>
        Find
      </button>
    {:else if whichgroup == 'status'}
      <p class="children-inline">
        Show
        <select id="statustype" bind:value={statustype} on:blur={loadgroup}>
          <option value="s">success</option>
          <option value="f">failure</option>
          <option value="b">success and failure</option>
        </select>
        grouping by
        <select id="statuslevel" bind:value={statuslevel} on:blur={loadgroup}>
          <option value="0">all</option>
          <option value="1">success/failure</option>
          <option value="2">if there a message?</option>
          <option value="3">date</option>
          <option value="4">date and time</option>
        </select>
      </p>
      {#if Array.isArray(smeltstatus)}
        <table border="1" id="typeTable">
          <tr>
            <th>Status</th>
            {#if statuslevel > 1}
              <th>Message</th>
            {/if}
            {#if statuslevel > 2}
              <th>Date</th>
            {/if}
            {#if statuslevel > 3}
              <th>time</th>
            {/if}
            <th>Identifier Count</th>
          </tr>
          {#each smeltstatus as status}
            <tr>
              <td>
                {#if status.key[0]}success{:else}fail{/if}
              </td>
              {#if statuslevel > 1}
                <td>
                  {#if status.key[1]}yes{:else}no{/if}
                </td>
              {/if}
              {#if statuslevel > 2}
                <td>{status.key[2]}</td>
              {/if}
              {#if statuslevel > 3}
                <td>{status.key[3]}</td>
              {/if}
              <td>
                {#if status.value > statuslimit}
                  <button
                    on:click={() => {
                      viewStatus(status.key);
                    }}>
                    {statuslimit}
                  </button>
                  of {status.value}
                {:else}
                  <button
                    on:click={() => {
                      viewStatus(status.key);
                    }}>
                    {status.value}
                  </button>
                {/if}
              </td>
            </tr>
          {/each}
        </table>
      {/if}
    {:else if whichgroup == 'date'}
      {#if Array.isArray(mdate)}
        <table border="1" id="typeTable">
          <tr>
            <th>
              <button
                on:click={() => {
                  mdatekey = [];
                  loadgroup();
                }}>
                Year
              </button>
            </th>
            {#if mdatekey.length > 0}
              <th>Month</th>
            {/if}
            {#if mdatekey.length > 1}
              <th>Day</th>
            {/if}
            {#if mdatekey.length > 2}
              <th>Hour</th>
            {/if}
            <th>Identifier Count</th>
          </tr>
          {#each mdate as date}
            <tr>
              <td>
                <button
                  on:click={() => {
                    mdatekey = date.key.slice(0, 1);
                    loadgroup();
                  }}>
                  {date.key[0]}
                </button>
              </td>
              {#if mdatekey.length > 0}
                <td>
                  <button
                    on:click={() => {
                      mdatekey = date.key.slice(0, 2);
                      loadgroup();
                    }}>
                    {date.key[1]}
                  </button>
                </td>
              {/if}
              {#if mdatekey.length > 1}
                <td>
                  <button
                    on:click={() => {
                      mdatekey = date.key.slice(0, 3);
                      loadgroup();
                    }}>
                    {date.key[2]}
                  </button>
                </td>
              {/if}
              {#if mdatekey.length > 2}
                <td>{date.key[3]}</td>
              {/if}
              <td>
                {#if mdatekey.length > 1}
                  <button
                    on:click={() => {
                      viewDate(date.key);
                    }}>
                    {date.value}
                  </button>
                {:else}{date.value}{/if}
              </td>
            </tr>
          {/each}
        </table>
      {/if}
    {:else if whichgroup == 'smelt'}
      {#if Array.isArray(sdate)}
        <table border="1" id="typeTable">
          <tr>
            <th>
              <button
                on:click={() => {
                  sdatekey = [];
                  loadgroup();
                }}>
                Year
              </button>
            </th>
            {#if sdatekey.length > 0}
              <th>Month</th>
            {/if}
            {#if sdatekey.length > 1}
              <th>Day</th>
            {/if}
            {#if sdatekey.length > 2}
              <th>Hour</th>
            {/if}
            <th>Identifier Count</th>
          </tr>
          {#each sdate as date}
            <tr>
              <td>
                <button
                  on:click={() => {
                    sdatekey = date.key.slice(0, 1);
                    loadgroup();
                  }}>
                  {date.key[0]}
                </button>
              </td>
              {#if sdatekey.length > 0}
                <td>
                  <button
                    on:click={() => {
                      sdatekey = date.key.slice(0, 2);
                      loadgroup();
                    }}>
                    {date.key[1]}
                  </button>
                </td>
              {/if}
              {#if sdatekey.length > 1}
                <td>
                  <button
                    on:click={() => {
                      sdatekey = date.key.slice(0, 3);
                      loadgroup();
                    }}>
                    {date.key[2]}
                  </button>
                </td>
              {/if}
              {#if sdatekey.length > 2}
                <td>{date.key[3]}</td>
              {/if}
              <td>
                {#if sdatekey.length > 1}
                  <button
                    on:click={() => {
                      viewSmelt(date.key);
                    }}>
                    {date.value}
                  </button>
                {:else}{date.value}{/if}
              </td>
            </tr>
          {/each}
        </table>
      {/if}
    {/if}
  {/if}
</fieldset>

{#if findnotfound.length > 0}
  <fieldset>
    <legend>
      (
      <label for="hidenotfound">
        <input type="checkbox" id="hidenotfound" bind:checked={hidenotfound} />
        Hide?
      </label>
      ) IDs not found
    </legend>
    {#if !hidenotfound}
      <ul>
        {#each findnotfound as notfoundid}
          <li>{notfoundid}</li>
        {/each}
      </ul>
    {/if}
  </fieldset>
{/if}

{#if docs.length > 0}
  {#if what === 'l'}
    <pre>
      {#each docs as doc}
        {doc._id}
        <br />
      {/each}
    </pre>
  {:else}
    <fieldset>
      <legend>
        (
        <label for="hidedocs">
          <input type="checkbox" id="hidedocs" bind:checked={hidedocs} />
          Hide?
        </label>
        ) DIP staging documents
      </legend>
      {#if !hidedocs}
        <table>
          <tr>
            <td>
              <button
                type="submit"
                on:click={() => {
                  selectAll();
                }}>
                Select
              </button>
              /
              <button
                type="submit"
                on:click={() => {
                  unselectAll();
                }}>
                unselect
              </button>
              all
            </td>

            {#if selectedIDs.length > 0}
              <td>
                {#if processindication}
                  {#if processindication.start}
                    Initiating {processindication.type} for {processindication.aips}
                    AIPs...
                    <span class="danger">Please Wait</span>
                  {:else}
                    Initiated {processindication.type} for {processindication.aips}
                    AIPs...
                  {/if}
                {:else}
                  <button
                    type="submit"
                    on:click={() => {
                      doAction('creation of archival manifests');
                    }}>
                    Initiate
                  </button>
                  <button
                    type="submit"
                    on:click={() => {
                      doAction('clear');
                    }}>
                    Clear
                  </button>
                {/if}
              </td>
            {/if}

            <td>
              <input type="checkbox" bind:checked={showdetails} />
              Details?
            </td>
            {#if showdetails}
              <td>
                <input type="checkbox" bind:checked={showmessage} />
                messages?
              </td>
            {/if}
          </tr>
        </table>
        <dl>
          {#each docs as doc}
            <dt>
              <span class="children-inline">
                <label>
                  <input
                    type="checkbox"
                    bind:checked={selected[doc._id]}
                    on:change={updateSelectedIDs} />
                  {doc._id}
                </label>
                {#if 'slug' in doc}(Slug='{doc.slug}'){/if}
              </span>
            </dt>
            <dd>
              {#if selected[doc._id]}
                <li class="slug">
                  <SlugResolver
                    label="New slug:"
                    mode="manifest"
                    bind:value={slugs[doc._id]} />
                </li>
              {/if}
              {#if showdetails}
                {#if 'repos' in doc && Array.isArray(doc.repos)}
                  <li>
                    date={doc.reposManifestDate} Repos=
                    {#each doc.repos as thisrepo, index}
                      {#if index > 0},{/if}
                      {thisrepo}
                    {/each}
                  </li>
                {/if}
                {#if 'smelt' in doc}
                  <li>Process Request date={doc.smelt.requestDate}</li>
                  {#if 'processDate' in doc.smelt && doc.smelt.processDate >= doc.smelt.requestDate}
                    <li>
                      Process
                      {#if doc.smelt.succeeded}sucessful{:else}failed{/if}
                      on {doc.smelt.processDate}
                    </li>

                    {#if showmessage && 'message' in doc.smelt && doc.smelt.message !== ''}
                      <textarea disabled="true">{doc.smelt.message}</textarea>
                    {/if}
                  {:else}
                    <li>In process queue</li>
                  {/if}
                {/if}
              {/if}
            </dd>
          {/each}
        </dl>
      {/if}
    </fieldset>
  {/if}
{/if}
