<script>
  async function viewRes(view = "", options = "") {
    const response = await fetch(`/couchview.json`, {
      methd: "POST",
      credentials: "same-origin",
      body: JSON.stringify({ view: view, options: options }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    console.log("response-+- in client", response);
  }
</script>
