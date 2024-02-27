import { createContext, useState, useContext } from "react";

// Create a context for authentication
const AuthContext = createContext();

export const AuthProvider = ({children}) => {


  const [user, setUser] = useState({});

  const logInUser = () => {
    setUser({ id: 5, isAdmin: false, loggedIn: true });

  };

  const logInAdmin = () => {
    setUser({ id: 1, isAdmin: true, loggedIn: true });
  };

  const logOut = () => {
    setUser({ id: null, loggedIn: false });
  };

return (
  <AuthContext.Provider value={{ user, logInUser, logInAdmin, logOut }}>
    {children}
  </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);
