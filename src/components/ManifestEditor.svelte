<script>
  import { stores } from "@sapper/app";
  import { onMount, afterUpdate } from "svelte";
  import SlugResolver from "../components/SlugResolver.svelte";
  import { getManifest } from "../api/manifest.js";
  import TextValueEditor from "../components/TextValueEditor.svelte";
  import IIIFTextDisplay from "./IIIFTextDisplay";

  export let id = undefined;

  export let manifest = {
    id,
    slug: "",
    label: {},
    summary: {},
    public: "",
    ocrPdf: "",

    canvases: [],
    parents: []
  };
  let reduceParents = {};
</script>

<style>
  section {
    display: block;
  }
  .left {
    width: 50%;
    position: fixed;
    float: left;
  }
  article ul {
    list-style: none;
    width: 65%;
  }
</style>

<section class="left">
  <article class="children-inline">
    <h4>Id:</h4>
    <input type="text" bind:value={manifest.id} readonly />
  </article>
  <article class="children-inline">
    <h4>Slug:</h4>
    <input type="text" bind:value={manifest.slug} />
  </article>
  <article class="children-inline">
    <h4>Public:</h4>
    <input type="text" bind:value={manifest.public} readonly />
  </article>
  <article>
    <h4>Label:</h4>
    <TextValueEditor
      bind:data={manifest.label}
      mandatory={true}
      textarea={false} />
  </article>

  {#if Object.getOwnPropertyNames(manifest.parents).length > 1}
    <article>
      <h4>Parents:</h4>
      {#each manifest.parents as parent}
        <ul>
          <li>
            <a href="/collection/{encodeURIComponent(parent.id)}">
              {parent.slug}
            </a>
          </li>
          <li>
            <IIIFTextDisplay data={parent.label} />
            (
            <a href={parent.noid}>{parent.slug}</a>
            )
          </li>

        </ul>
      {/each}
    </article>
  {/if}
</section>
<!-- <section>
  {#if Object.getOwnPropertyNames(manifest.canvases).length > 1}
    <h4>Canvases:</h4>
    {#each manifest.canvases as canvas}
      <ul>
        <li>{canvas.id}</li>
      </ul>
    {/each}
  {/if}
</section> -->
