<script>
  import TextDisplay from "../IIIF/TextDisplay";
  export let parents = [];
</script>

<style>
  table {
    white-space: normal;
  }
</style>

<h2>Parent Collections</h2>
{#if parents.length > 1}
  <table>
    {#each parents as parent}
      <tr>
        <td>
          <a href="/collection/{parent.id}">{parent.slug}</a>
        </td>
        <td>
          <TextDisplay data={parent.label} />
        </td>
        <td>Remove (TODO)</td>
      </tr>
    {/each}
  </table>
{/if}
<p>TODO: add an "Add to collection" interface</p>
<p>
  TODO: add context-sensitive buttons for creating, updating, and/or publishing
  the collection
</p>
