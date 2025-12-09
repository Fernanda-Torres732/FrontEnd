import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("usuario");
    return saved ? JSON.parse(saved) : null;
  });

  const loginUser = (data) => {
    setUser(data);
    sessionStorage.setItem("usuario", JSON.stringify(data));
  };

  const logoutUser = () => {
  setUser(null);
  sessionStorage.removeItem("usuario");

  // Limpia historial para evitar regresar
  window.history.pushState(null, "", "/login");
};

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
