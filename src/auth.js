import { get, readable } from "svelte/store";
var value = "LOADING";
export const state = readable(value, function auth(set) {
  fetch("https://auth.canadiana.ca/1/auth", {
    credentials: "include"
  })
    .then(function(response) {
      if (response.status >= 200 && response.status < 300) {
        value = "SUCCESS";
        set(value);
      } else if (response.status >= 400) {
        value = "FAILED";
        set(value);
      }
      return response.json();
    })
    .then(function(out) {
      set(out.name);
    });
});
