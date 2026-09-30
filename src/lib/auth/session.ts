const listeners = new Set<() => void>();
let revision = 0;

export const session = {
  getAccessToken: () => localStorage.getItem("access_token"),
  getRefreshToken: () => localStorage.getItem("refresh_token"),
  getRevision: () => revision,
  updateAccessToken(accessToken: string) {
    localStorage.setItem("access_token", accessToken);
  },
  save(tokens: { access_token: string; refresh_token: string }) {
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    revision += 1;
  },
  clear() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    revision += 1;
    listeners.forEach((listener) => listener());
  },
  onInvalidate(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

// A logout/account change in another tab invalidates the loaded profile.
// An access-token refresh keeps the same account and does not interrupt the UI.
window.addEventListener("storage", (event) => {
  if (
    event.storageArea === localStorage &&
    (event.key === null ||
      event.key === "refresh_token" ||
      (event.key === "access_token" && event.newValue === null))
  ) {
    revision += 1;
    listeners.forEach((listener) => listener());
  }
});
