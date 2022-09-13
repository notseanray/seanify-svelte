import { writable } from "svelte/store";

export const seanifyUser = writable({
  username: "",
  serverside: true,
  thumbnails: true,
  autoplay: true,
  allow_followers: true,
  public_account: true,
  activity: true,
  display_name: "",
  analytics: true,
});
