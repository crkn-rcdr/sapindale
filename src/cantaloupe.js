const prefix = process.env.CANTALOUPE;

function url(token, path, isThumbnail) {
  let size = isThumbnail ? "!100x100" : "full";
  return [
    [prefix, encodeURIComponent(path), "full", size, "0", "default.jpg"].join(
      "/"
    ),
    ["token", token].join("=")
  ].join("?");
}

export { url as default };
