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
  function removeItem(index) {
    items = [...items.slice(0, index), ...items.slice(index + 1)];
  }
</script>

<style>
  .dragList {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid var(--color-bg-secondary);
    border-radius: var(--border-radius);
    border-spacing: 0;
  }
  .dragList > :nth-child(even) {
    background-color: var(--color-accent);
  }
  .dragListItem {
    display: flex;
    align-items: center;
  }
  .dragListItem > * {
    margin: 0 0.5rem;
  }
  .dragListItem > .icon {
    min-width: 2rem;
    min-height: 2rem;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
  }
  .dragListItem > .expand {
    margin-right: auto;
  }
  .handle {
    color: var(--color);
  }
  .handle:hover,
  .handle:focus {
    background-color: var(--color);
    color: var(--color-bg);
  }
  .danger {
    color: var(--color-danger);
  }
  .danger:hover,
  .danger:focus {
    background-color: var(--color-danger);
    color: var(--color-bg);
  }
</style>

<ul
  class="dragList"
  use:dndzone={{ items, dragDisabled, flipDurationMs }}
  on:consider={handleConsider}
  on:finalize={handleFinalize}>
  {#each items as item, i (item.id)}
    <li class="dragListItem" animate:flip={{ duration: flipDurationMs }}>
      <button
        tabindex={dragDisabled ? 0 : -1}
        aria-label="drag-handle"
        class="not-styled icon handle"
        style={dragDisabled ? 'cursor: grab' : 'cursor: grabbing'}
        on:mousedown={startDrag}
        on:touchstart={startDrag}
        on:keydown={handleKeyDown}>
        <HandleIcon />
      </button>
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
      <button class="not-styled icon danger" on:click={removeItem(i)}>
        <XIcon />
      </button>
    </li>
  {/each}
</ul>
