import { get, readable } from "svelte/store";
var value;
export const state = readable(value, function auth(set) {
  fetch("https://auth.canadiana.ca/1/auth", {
    credentials: "include"
  }).then(function(response, data) {
    if (response.status == 200) {
      value = "SUCCESS";
      set(value);
    } else if (response.status == 401) {
      value = "FAILED";
      set(value);
    }
  });
});
