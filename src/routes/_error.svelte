<script>
  export let status;
  export let error;
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<h1>{status}</h1>

<p>{error.message}</p>

{#if process.dev}
  {#if error.name}<p>Name: {error.name}</p>{/if}
  {#if error.stack}<p>Stack</p>
    <pre>{error.stack}</pre>{/if}
{/if}
