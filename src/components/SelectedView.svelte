<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let result;

  function selectedValue() {
    dispatch("message"),
      {
        text: result
      };
  }
</script>

<li>{result.key} {result.value}</li>
