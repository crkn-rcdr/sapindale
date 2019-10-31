const tailwindcss = require("tailwindcss");

//To Purge
const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./src/**/*.svelte", "./src/**/*.html"],
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
});
module.exports = {
  plugins: [
    tailwindcss("./tailwind.js"),
    //To purge
    ...(process.env.NODE_ENV === "production" ? [purgecss] : [])
  ]
};
