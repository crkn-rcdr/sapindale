<script>
  import { state as authState } from "../auth.js";
  import { onMount, createEventDispatcher } from "svelte";
  import SlugResolver from "../components/SlugResolver.svelte";
  import { collectionrequest as request } from "../api/collection.js";
  import TextValueEditor from "../components/TextValueEditor.svelte";
  import SortableList from "../components/SortableList.svelte";
  /* import CollectionItems from "../components/CollectionItems.svelte"; */

  export let id = undefined;
  const dispatch = createEventDispatcher();
  let token = $authState.token;
  let rowcount = [];
  let itemCount = [];
  let items;
  let showItems = ["id", "label", "slug", "type"];

  onMount(async () => {
    await getCollectionRecords({ id });
  });

  async function getCollectionRecords({ id }) {
    try {
      rowcount = await request(token, id);
    } catch (ignore) {}
  }
  function displayItems(event) {
    dispatch("select", { rowcount });
    console.log("show", rowcount);
  }
</script>

<style>
  .line {
    display: -webkit-box;
  }
  .spacewidth {
    line-height: 0.5rem;
  }
  .scroll {
    overflow-y: scroll;
    height: 100vh;
    width: 50%;
    background-color: #1d808b15;
    color: #141010;
  }
  .add {
    line-height: 1%;
    font-size: small;
  }
  .align {
    display: inline-grid;
  }
</style>

{#if rowcount}
  <ul>
    <li>
      {#each Object.keys(rowcount) as item}
        {#if typeof rowcount[item] == 'object'}
          <li>
            {item}:
            {#if item !== 'items' && item !== 'parents'}
              <span class="line">
                <table>
                  <tr>
                    <th>Language</th>
                    <th>Value</th>
                  </tr>
                  {#each Object.keys(rowcount[item]) as element}
                    <tr>
                      <td>
                        <input type="text" bind:value={element} />
                      </td>
                      <td>
                        <input
                          type="text"
                          bind:value={rowcount[item][element]} />
                      </td>
                    </tr>
                  {/each}
                </table>
              </span>
              {#if item === 'label'}
                <span class="align">
                  <TextValueEditor />
                  <button class="add">Add</button>
                </span>
              {/if}
            {/if}
            {#if item === 'items' || item === 'parents'}
              <div class="scroll">
                {#each Object.keys(rowcount[item]) as element}
                  <ul>
                    <pre>
                      {#each Object.keys(rowcount[item][element]) as items}
                        {#if showItems.includes(items)}
                          <li class="spacewidth" on:click={displayItems}>

                            {#if items !== 'label'}
                              {items}:{rowcount[item][element][items]}
                            {:else if items == 'label'}
                              {#each Object.keys(rowcount[item][element][items]) as labels}
                                {labels}:{rowcount[item][element][items][labels]}
                              {/each}
                            {/if}

                          </li>
                        {/if}
                      {/each}
                    </pre>
                  </ul>
                {/each}
              </div>
            {/if}
          </li>
        {:else}
          <li>
            {item}:{rowcount[item]}
            <!--  <label for="item">{item}:</label>
            <input type="text" bind:value={rowcount[item]} /> -->
          </li>
        {/if}
      {/each}

    </li>
  </ul>

  <div class="buttons">
    <button id="save">Save</button>
    <button id="publish">Save & Publish</button>
  </div>
{/if}
