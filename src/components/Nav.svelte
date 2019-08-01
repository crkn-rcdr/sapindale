<script>
  import { state } from "../auth.js";
  import { onMount } from "svelte";
  var value = [];
  var name;
  var redirectUrl;
  export let segment;

  onMount(async () => {
    var ref = window.location.origin;
    redirectUrl = ref;
    state.subscribe(checkstate => {
      value.push(checkstate);

      name = value[2];
    });
  });
</script>

<style>
  nav {
    border-bottom: 1px solid rgba(33, 33, 33, 0.1);
    font-weight: 300;
    padding: 0 1em;
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

  /* li.right {
    float: right;
  } */

  .selected {
    position: relative;
    display: inline-block;
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

  #login {
    display: block;
    float: right;
  }

  #Welcome {
    float: right;
  }
</style>

<nav>
  <ul>
    <li>
      <a class:selected={segment === undefined} href="/.">Home</a>
    </li>
    {#if value[1] === 'SUCCESS' && value[2] !== 'undefined'}
      <p id="Welcome">Logged in as:{name}</p>
    {:else}
      <li class="right" id="login">
        <a
          href="https://auth.canadiana.ca/1/azuread/login?redirectUrl={redirectUrl}"
          id="login">
          Please Login
        </a>
      </li>
    {/if}
  </ul>
</nav>
