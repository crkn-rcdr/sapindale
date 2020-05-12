<script>
  import { state as authState } from "../auth.js";
  import navLink from "./navLink.svelte";
  import navList from "./navList.svelte";
</script>

<svelte:head>
  <title>Sapindale — Canadiana access platform administration</title>
</svelte:head>

<navList>
  <navLink>
    <a href="/couchview">CouchView</a>
  </navLink>
  <navLink>
    <a href="/navLink">Legacy Tools</a>
  </navLink>
  <navLink>
    <a
      href="{process.env.UPHOLSTERY}/cookie?token={$authState.token}"
      id="Futon"
      target="_blank">
      Futon (Please do not edit unless you know what you are doing)
    </a>
  </navLink>
</navList>
