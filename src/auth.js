import { readable } from "svelte/store";

export const state = readable({ status: "LOADING" }, function auth(set) {
  fetch("https://auth.canadiana.ca/1/auth", {
    credentials: "include"
  })
    .then(function(response) {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else if (response.status >= 400) {
        return Promise.resolve({});
      }
    })
    .then(function(out) {
      if (out.token) {
        set({
          status: "SUCCESS",
          name: out.name,
          token: out.token,
          email: out.email
        });
      } else {
        set({ status: "FAILED" });
      }
    });
});
