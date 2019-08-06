import { get, readable } from "svelte/store";
var name;
var value;
export const state = readable({ status: "LOADING" }, function auth(set) {
  fetch("https://auth.canadiana.ca/1/auth", {
    credentials: "include"
  })
    .then(function(response) {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else if (response.status >= 400) {
        set({ status: "FAILED" });
        return Promise.resolve({});
      }
    })
    .then(function(out) {
      set((name = out.name));
      set((value = out.token));
      if (out.token !== "undefined") {
        set({
          status: "SUCCESS",
          name: name,
          token: value
        });
      }
    });
});
