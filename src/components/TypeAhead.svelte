<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { state as authState } from "../auth.js";
  import {
    databases,
    documents,
    design_docs,
    design_doc_views
  } from "../couch.js";
  const dispatch = createEventDispatcher();

  let token = $authState.token;

  export let db = undefined;
  export let ddoc = undefined;
  export let label = "Please provide a label for this component.";
  export let mode = db ? "documents" : "databases";
  let uid = `${mode}.${db ? db : "nil"}.${ddoc ? ddoc : "nil"}`;
  let datalistId = `data.${uid}`;
  let inputId = `input.${uid}`;

  let itemFragment = "";
  let datalist = [];

  onMount(async () => {
    await lookupIds();
  });

  async function lookupIds(event) {
    dispatch("deselected");
    try {
      if (datalist.length < 1) {
        if (mode == "databases") {
          datalist = await databases(token);
        } else if (mode == "design_doc_views" && db && ddoc) {
          datalist = Object.keys(await design_doc_views(token, db, ddoc));
        } else if (mode == "design_docs" && db) {
          datalist = (await design_docs(token, db)).map(row =>
            row.id.substring(8)
          );
        }
      }
      if (mode == "documents") {
        datalist = (await documents(token, db, {
          startkey: JSON.stringify(itemFragment),
          endkey: JSON.stringify(`${itemFragment}\uFFEF`),
          limit: 12
        })).map(row => row.id);
      }
    } catch (ignore) {}
  }

  function selectItem(event) {
    dispatch("selected", { value: itemFragment });
  }
</script>

<style>
  input {
    border: 1px solid var(--brand-color);
    font-size: 120%;
    width: 30ch;
    padding: 10px;
  }
</style>

<div>
  <label for={inputId}>{label}</label>
  <input
    type="text"
    id={inputId}
    list={datalistId}
    disabled={datalist.length < 1}
    bind:value={itemFragment}
    on:input={lookupIds}
    on:change={selectItem} />
  <datalist id={datalistId}>
    {#each datalist as item}
      <option>{item}</option>
    {/each}
  </datalist>
</div>
