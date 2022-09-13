import { writable } from "svelte/store";
import { callExternalApi } from "./external-api.service";

const apiServerUrl = import.meta.env.VITE_API_SERVER_URL;

export const message = writable("");

export const getPublicResource = async () => {
  const config = {
    url: `${apiServerUrl}/api/user/public`,
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  };

  const { data, error } = await callExternalApi({ config });

  if (data) {
    message.set(JSON.stringify(data, null, 2));
  }

  if (error) {
    message.set(JSON.stringify(error, null, 2));
  }
};

const seanifyRequest = async (config) => {
  const { data, error } = await callExternalApi({ config });
    console.log(data)
    console.log(error)
  if (data) {
    return { result: data, error: false };
  }
  if (error) {
    return { result: error, error: true };
  }
};

export const checkUsername = async (username) => {
  const config = {
    url: `${apiServerUrl}/api/user/taken`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      NewUsername: btoa(username),
    },
  };
  const req = await seanifyRequest(config);
  return !req.error && req.result && req.result.text == "not taken";
};

export const newUser = async (
  accessToken,
  username,
  serverside,
  thumbnails,
  autoplay,
  allow_followers,
  public_account,
  activity,
  display_name,
  analytics,
) => {
  const config = {
    url: `${apiServerUrl}/api/user/new`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      username: username,
      serverside: serverside,
      thumbnails: thumbnails,
      autoplay: autoplay,
      allow_followers: allow_followers,
      public_account: public_account,
      activity: activity,
      display_name: display_name,
      analytics: analytics,
    },
  };
  return await seanifyRequest(config);
};

export const getProtectedResource = async (accessToken) => {
  const config = {
    url: `${apiServerUrl}/api/user/protected`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const { data, error } = await callExternalApi({ config });

  if (data) {
    message.set(JSON.stringify(data, null, 2));
  }

  if (error) {
    message.set(JSON.stringify(error, null, 2));
  }
};

export const getAdminResource = async (accessToken) => {
  const config = {
    url: `${apiServerUrl}/api/user/admin`,
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const { data, error } = await callExternalApi({ config });

  if (data) {
    message.set(JSON.stringify(data, null, 2));
  }

  if (error) {
    message.set(JSON.stringify(error, null, 2));
  }
};
