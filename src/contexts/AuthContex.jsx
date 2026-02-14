import { useContext, createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    
  };

  const logout = async () => {
   
  };


  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout
      }}
    >{children}
    </AuthContext.Provider>);
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};