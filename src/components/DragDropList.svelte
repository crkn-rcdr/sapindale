<script>
  import { flip } from "svelte/animate";
  import IIIFTextDisplay from "./IIIFTextDisplay";
  import Handle from "../components/Handle.svelte";
  import FaArrowsAlt from "svelte-icons/fa/FaArrowsAlt.svelte";
  import FaListOl from "svelte-icons/fa/FaListOl.svelte";

  export let data = {};

  let dragged;
  let grabbed;
  let lastTarget;
  let mouseY = 0; // pointer y coordinate within client
  let offsetY = 0; // y distance from top of grabbed element to pointer
  let layerY = 0; // distance from top of list to top of client
  function grab(clientY, element) {
    // modify grabbed element
    grabbed = element;
    grabbed.dataset.grabY = clientY;
    // modify dragged element (which is actually dragged)
    dragged.innerHTML = grabbed.innerHTML;
    // record offset from cursor to top of element

    offsetY = grabbed.getBoundingClientRect().y - clientY;
    drag(clientY);
  }
  // drag handler updates cursor position
  function drag(clientY) {
    if (grabbed) {
      mouseY = clientY;
      layerY = dragged.parentNode.getBoundingClientRect().y;
    }
  }
  // touchEnter handler emulates the mouseenter event for touch input
  // (more or less)
  function touchEnter(ev) {
    drag(ev.clientY);
    // trigger dragEnter the first time the cursor moves over a list item
    let target = document
      .elementFromPoint(ev.clientX, ev.clientY)
      .closest(".item");
    if (target && target != lastTarget) {
      lastTarget = target;
      dragEnter(ev, target);
    }
  }
  function dragEnter(ev, target) {
    // swap items in data
    if (grabbed && target != grabbed && target.classList.contains("item")) {
      moveData(parseInt(grabbed.dataset.index), parseInt(target.dataset.index));
    }
  }
  // does the actual moving of items in data
  function moveData(from, to) {
    let tempAssign = data[from];
    data = [...data.slice(0, from), ...data.slice(from + 1)];
    data = [...data.slice(0, to), tempAssign, ...data.slice(to)];
  }
  function release(ev) {
    grabbed = null;
  }
</script>

<style>
  div {
    display: flex;
    width: 80%;
  }
  .list {
    cursor: hand;
    z-index: 5;
    display: flex;
    flex-direction: column;
    list-style: none;
  }
  .item {
    display: inline-flex;
    user-select: none;
    z-index: 2;
  }
  #dragged {
    pointer-events: none;
    z-index: -5;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }
  #dragged * {
    pointer-events: none;
  }
  #dragged.haunting {
    z-index: 20;
    opacity: 1;
  }
  .orderList {
    height: 20%;
    width: 20%;
    display: inline-flex;
  }
</style>

<main>
  <div
    bind:this={dragged}
    id="dragged"
    class={grabbed ? 'item haunting' : 'item'}
    style={'top: ' + (mouseY + offsetY - layerY) + 'px'}>
    <p />
  </div>
  <div
    class="list"
    on:mousemove={function(ev) {
      ev.stopPropagation();
      drag(ev.clientY);
    }}
    on:touchmove={function(ev) {
      ev.stopPropagation();
      drag(ev.touches[0].clientY);
    }}
    on:mouseup={function(ev) {
      ev.stopPropagation();
      release(ev);
    }}
    on:touchend={function(ev) {
      ev.stopPropagation();
      release(ev.touches[0]);
    }}>
    {#each data as items, i}
      <div>
        <div
          class="item"
          data-index={i}
          data-id={items.id}
          data-grabY="0"
          on:mousedown={function(ev) {
            grab(ev.clientY, this);
          }}
          on:touchstart={function(ev) {
            grab(ev.touches[0].clientY, this);
          }}
          on:mouseenter={function(ev) {
            ev.stopPropagation();
            dragEnter(ev, ev.target);
          }}
          on:touchmove={function(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            touchEnter(ev.touches[0]);
          }}>
          <Handle>
            <FaArrowsAlt />
          </Handle>
        </div>
        <div>
          <aside class="orderList">
            <FaListOl />
          </aside>
        </div>
        <div>
          {#if items.id.startsWith('69429/s')}
            <ul class="list">
              <li>
                <a href="/collection/{encodeURIComponent(items.id)}">
                  {items.slug}
                </a>
              </li>
              <li>
                <IIIFTextDisplay data={items.label} />
              </li>
            </ul>
          {:else if items.id.startsWith('69429/m')}
            <ul class="list">
              <li>
                <a href="/manifest/{encodeURIComponent(items.id)}">
                  {items.slug}
                </a>
              </li>
              <li>
                <IIIFTextDisplay data={items.label} />
              </li>
            </ul>
          {:else}
            <ul>
              <p>The canvas items comes here</p>
            </ul>
          {/if}

        </div>
      </div>
    {/each}

  </div>
</main>
