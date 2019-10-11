<script>
  import TypeAhead, { value } from "../components/TypeAhead.svelte";
  let tempVar = "";
  function check(event) {
    tempVar = event.detail.text;
    console.log("Event at parent: ", tempVar);
  }
</script>

<svelte:head>
  <title>Sapindale — Deposit from preservation</title>
</svelte:head>

<h1>Deposit from preservation</h1>
<TypeAhead db="dipstaging" />
<p on:message={check}>This is eventHandler</p>
