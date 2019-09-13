<script>
  import CouchView from "../components/CouchView.svelte";

  let options = { group: true, group_level: 1 };
</script>

<CouchView dbname="copresentation" ddoc="tdr" viewname="coltitles" {options} />
