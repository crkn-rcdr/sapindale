<script>
  /*  import Nav from "../components/Nav.svelte"; */
  import { state as authState } from "../auth.js";
  import { onMount } from "svelte";
  var redirectUrl;
  export let segment;

  onMount(async () => {
    redirectUrl = window.location.origin;
  });
</script>

<style>
  main {
    padding: 1em;
    font-weight: 300;
  }

  ul {
    margin: 0;
    padding: 0;
    max-width: none;
  }

  /* clearfix */
  ul::after {
    content: "";
    display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;
  }

  li.right {
    float: right;
  }

  .selected {
    position: relative;
    display: inline-block;
    border-bottom: 1px solid rgba(33, 33, 33, 0.1);
  }

  .selected::after {
    position: absolute;
    content: "";
    width: calc(100% - 1em);
    height: 2px;
    background-color: var(--brand-color);
    display: block;
    bottom: -1px;
  }

  li > * {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
  }
  #anchor {
    border-bottom: 1px solid rgba(33, 33, 33, 0.1);
  }
</style>

<main {segment}>
  <ul>
    <li>
      <a class:selected={segment === undefined} href="/." id="anchor">Home</a>
    </li>
    <li class="right">
      {#if $authState.status === 'SUCCESS'}
        <span>Logged in as: {$authState.name}</span>
      {:else}
        <a
          href="https://auth.canadiana.ca/1/azuread/login?redirectUrl={redirectUrl}"
          id="login">
          Login
        </a>
      {/if}
    </li>
  </ul>
  <slot>
    {#if $authState.status === 'SUCCESS'}
      <span>Logged in as: {$authState.name}</span>
    {:else}
      <a
        href="https://auth.canadiana.ca/1/azuread/login?redirectUrl={redirectUrl}"
        id="login">
        Login
      </a>
    {/if}
  </slot>
</main>
