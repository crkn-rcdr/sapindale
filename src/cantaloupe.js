const prefix = process.env.CANTALOUPE;
function url(ctoken, path, isThumbnail) {
  let size = isThumbnail ? "!100,100" : "full";
  return [
    [prefix, encodeURIComponent(path), "full", size, "0", "default.jpg"].join(
      "/"
    ),
    ["token", ctoken].join("=")
  ].join("?");
}
export { url as default };
