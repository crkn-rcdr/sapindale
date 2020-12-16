<script>
  // Modifies the example found here: https://svelte.dev/repl/4949485c5a8f46e7bdbeb73ed565a9c7?version=3.24.1
  import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
  import { flip } from "svelte/animate";
  import IIIFTextDisplay from "./IIIFTextDisplay";
  import HandleIcon from "svelte-icons/fa/FaBars.svelte";
  import XIcon from "svelte-icons/fa/FaTimesCircle.svelte";
  import OrderedIcon from "svelte-icons/fa/FaListOl.svelte";
  import UnorderedIcon from "svelte-icons/fa/FaListUl.svelte";
  import PdfIcon from "svelte-icons/md/MdPictureAsPdf.svelte";
  import MulticanvasIcon from "svelte-icons/md/MdLibraryBooks.svelte";

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
  .dragList {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .dragListItem {
    display: flex;
    align-items: center;
  }
  .dragListItem > :not(:first-child) {
    margin-left: 1rem;
  }
  .dragListItem > .icon {
    flex: min-content 1 0;
    width: 2rem;
    height: 2rem;
  }
  .dragListItem > .expand {
    flex: auto 1 0;
  }
  .handle {
    color: var(--color);
  }
  .handle:hover,
  .handle:focus {
    background-color: var(--color);
    color: white;
  }
</style>

<ul
  class="dragList"
  use:dndzone={{ items, dragDisabled, flipDurationMs }}
  on:consider={handleConsider}
  on:finalize={handleFinalize}>
  {#each items as item (item.id)}
    <li class="dragListItem" animate:flip={{ duration: flipDurationMs }}>
      <span
        tabindex={dragDisabled ? 0 : -1}
        aria-label="drag-handle"
        class="icon handle"
        style={dragDisabled ? 'cursor: grab' : 'cursor: grabbing'}
        on:mousedown={startDrag}
        on:touchstart={startDrag}
        on:keydown={handleKeyDown}>
        <HandleIcon />
      </span>
      <span class="icon">
        {#if item.type === 'manifest'}
          {#if item.manifestType === 'pdf'}
            <PdfIcon />
          {:else}
            <MulticanvasIcon />
          {/if}
        {:else if item.ordered}
          <OrderedIcon />
        {:else}
          <UnorderedIcon />
        {/if}
      </span>
      <a class="expand" href="/{item.type}/{encodeURIComponent(item.id)}">
        <IIIFTextDisplay data={item.label} />
      </a>
      <span class="icon danger">
        <XIcon />
      </span>
    </li>
  {/each}
</ul>
