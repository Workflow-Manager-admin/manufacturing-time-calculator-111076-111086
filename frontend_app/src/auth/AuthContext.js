import React, { createContext, useContext, useState } from "react";

// PUBLIC_INTERFACE
const AuthContext = createContext();

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  // Simulated authentication state
  const [user, setUser] = useState(() => {
    // Try from localStorage for persistent login
    const u = window.localStorage.getItem("qrm-mct-user");
    return u ? JSON.parse(u) : null;
  });

  // PUBLIC_INTERFACE
  const login = ({ username, password }) => {
    // DEMO ONLY! Accepts any non-empty username/password
    if (username && password) {
      // persist user
      window.localStorage.setItem("qrm-mct-user", JSON.stringify({ username }));
      setUser({ username });
      return Promise.resolve({ username });
    }
    return Promise.reject(new Error("Invalid credentials"));
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    window.localStorage.removeItem("qrm-mct-user");
    setUser(null);
  };

  // PUBLIC_INTERFACE
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
