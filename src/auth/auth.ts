const AUTH_KEY = "isLoggedIn";

export const login = (username: string, password: string) => {
  if (username === "baske" && password === "1234") {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isLoggedIn = () => {
  return localStorage.getItem(AUTH_KEY) === "true";
};
