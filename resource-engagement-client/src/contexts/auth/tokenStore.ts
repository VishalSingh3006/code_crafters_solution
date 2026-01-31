export const tokenStore = {
  get: () => sessionStorage.getItem("auth_token"),
  set: (token: string | null) => {
    if (token) {
      sessionStorage.setItem("auth_token", token);
    } else {
      sessionStorage.removeItem("auth_token");
    }
  },
  clear: () => {
    sessionStorage.removeItem("auth_token");
  },
};
