import { refreshToken } from "./auth";

const customFetch = async (url, options = {}) => {
  let response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (response.status === 401) {
    // Token might be expired, try to refresh it
    const newAccessToken = await refreshToken();
    if (newAccessToken) {
      // Retry the original request with the new access token
      response = await fetch(url, {
        ...options,
        credentials: "include",
      });
    }
  }

  return response;
};

export default customFetch;