<script>
  export let data = {};

  let display = Object.keys(data)
    .sort()
    .map(key => data[key])
    .join(" = ");
</script>

{display}
