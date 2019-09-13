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
    .then(function(data) {
      if (data.token) {
        set({
          status: "SUCCESS",
          ...data
        });
      } else {
        set({ status: "FAILED" });
      }
    });
});
