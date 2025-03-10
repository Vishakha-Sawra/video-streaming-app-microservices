export const refreshToken = async () => {
  try {
    const response = await fetch("http://localhost:8080/refresh-token", {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Token refreshed:", data.accessToken);
      return data.accessToken;
    } else {
      console.error("Failed to refresh token");
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
};