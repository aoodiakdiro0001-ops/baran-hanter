import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("bh_token") || "");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bh_user") || "null");
    } catch {
      return null;
    }
  });

  const value = useMemo(
    () => ({
      token,
      user,
      setSession: (nextToken, nextUser) => {
        setToken(nextToken || "");
        setUser(nextUser || null);
        if (nextToken) localStorage.setItem("bh_token", nextToken);
        else localStorage.removeItem("bh_token");
        if (nextUser) localStorage.setItem("bh_user", JSON.stringify(nextUser));
        else localStorage.removeItem("bh_user");
      },
      logout: () => {
        setToken("");
        setUser(null);
        localStorage.removeItem("bh_token");
        localStorage.removeItem("bh_user");
      },
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
