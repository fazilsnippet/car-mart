import { createContext, useContext } from "react";

const AuthContext = createContext({ isAdmin: false });

export function AuthProvider({ children, isAdmin = false }) {
  return (
    <AuthContext.Provider value={{ isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
