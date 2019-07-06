<script>
  import Nav from "../components/Nav.svelte";

  const titles = {
    default: "Canadiana access platform administration",
    deposit: "Deposit from preservation",
    collection: "Collection Management"
  };

  export let segment;
  $: title = titles[segment] || titles["default"];
</script>

<style>
  main {
    position: relative;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>

<svelte:head>
  <title>Sapindale — {title}</title>
</svelte:head>

<Nav {segment} />

<main>
  <h1>{title}</h1>
  <slot />
</main>
