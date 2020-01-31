<script>
  //SortableList.svelte FROM svelte-sortable-list package
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  import { flip } from "svelte/animate";

  let current = "";
  // FLIP ANIMATION
  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 200),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;

      return {
        duration: 600,
        easing: quintOut,
        css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
      };
    }
  });

  // DRAG AND DROP
  let isOver = false;
  const getDraggedParent = node =>
    (node.dataset.index && node.dataset) || getDraggedParent(node.parentNode);
  const start = ev => {
    ev.dataTransfer.setData("source", ev.currentTarget.dataset.index);
  };
  const over = ev => {
    ev.preventDefault();
    let dragged = getDraggedParent(ev.target);
    if (isOver !== dragged.id) isOver = JSON.parse(dragged.id);
  };
  const leave = ev => {
    let dragged = getDraggedParent(ev.target);
    if (isOver === dragged.id) isOver = false;
  };
  const drop = ev => {
    isOver = false;
    ev.preventDefault();
    let dragged = getDraggedParent(ev.target);
    let from = ev.dataTransfer.getData("source");
    let to = dragged.index;
    reorder({ from, to });
  };

  // DISPATCH REORDER
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  const reorder = ({ from, to }) => {
    let newList = [...list];
    let sortItem = newList.splice(from, 1)[0];
    newList.splice(to, 0, sortItem);
    dispatch("sort", newList);
  };

  // UTILS
  const getKey = item => (key ? item[key] : item);

  // PROPS
  export let list;
  export let key;
</script>

<style>
  /* ul {
    list-style: none;
    padding: 0;
  } */
  .over {
    border-color: rgba(48, 12, 200, 0.2);
  }
  .thumbList {
    display: flex;
    margin-top: 1em;
    overflow-x: auto;
    max-width: none;
  }

  .thumbList li {
    min-width: 150px;
  }

  .thumbList li + li {
    margin-left: 1em;
  }
</style>

{#if list && list.length}

  <ul class="thumbList">
    {#each list as item, index (getKey(item))}
      <li
        data-index={index}
        data-id={JSON.stringify(getKey(item))}
        draggable="true"
        on:dragstart={start}
        on:dragover={over}
        on:dragleave={leave}
        on:drop={drop}
        class={current === 'True' ? 'active' : ''}
        in:receive={{ key: getKey(item) }}
        out:send={{ key: getKey(item) }}
        animate:flip={{ duration: 300 }}
        class:over={getKey(item) === isOver}>
        <slot {item} {index}>
          <p>{getKey(item)}</p>
          <p>{item.id}</p>
        </slot>
      </li>
    {/each}
  </ul>
{/if}
