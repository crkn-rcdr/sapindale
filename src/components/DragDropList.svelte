<script>
  // Modifies the example found here: https://svelte.dev/repl/4949485c5a8f46e7bdbeb73ed565a9c7?version=3.24.1
  import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import IIIFTextDisplay from "./IIIFTextDisplay";
  import FaBars from "svelte-icons/fa/FaBars.svelte";
  export let items = [];
  const flipDurationMs = 200;
  let dragDisabled = true;

  function handleConsider(e) {
    const {
      items: newItems,
      info: { source, trigger }
    } = e.detail;
    items = newItems;
    // Ensure dragging is stopped on drag finish via keyboard
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      dragDisabled = true;
    }
  }
  function handleFinalize(e) {
    const {
      items: newItems,
      info: { source }
    } = e.detail;
    items = newItems;
    // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
    if (source === SOURCES.POINTER) {
      dragDisabled = true;
    }
  }
  function startDrag(e) {
    // preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
    e.preventDefault();
    dragDisabled = false;
  }
  function handleKeyDown(e) {
    if ((e.key === "Enter" || e.key === " ") && dragDisabled)
      dragDisabled = false;
  }
</script>

<style>
  /* div {
    position: relative;
    height: 1.5em;
    width: 10em;
    text-align: center;
    border: 1px solid black;
    margin: 0.2em;
    padding: 0.3em;
  } */
  .icon {
    display: block;
    width: 2em;
    height: 2em;
    color: var(--color);
  }
  .handle:hover,
  .handle:focus {
    background-color: var(--color);
    color: white;
  }
</style>

<table
  use:dndzone={{ items, dragDisabled, flipDurationMs }}
  on:consider={handleConsider}
  on:finalize={handleFinalize}>
  {#each items as item (item.id)}
    <tr animate:flip={{ duration: flipDurationMs }}>
      <td>
        <span
          tabindex={dragDisabled ? 0 : -1}
          aria-label="drag-handle"
          class="icon handle"
          style={dragDisabled ? 'cursor: grab' : 'cursor: grabbing'}
          on:mousedown={startDrag}
          on:touchstart={startDrag}
          on:keydown={handleKeyDown}>
          <FaBars />
        </span>
      </td>
      <td>Type icon (TODO)</td>
      <td>
        <a href="/{item.type}/{encodeURIComponent(item.id)}">
          <IIIFTextDisplay data={item.label} />
        </a>
      </td>
      <td>Remove (TODO)</td>
    </tr>
  {/each}
</table>
