import { createContext, useState, useContext } from "react";

// Create a context for authentication
const AuthContext = createContext();

export const AuthProvider = ({children}) => {


  const [user, setUser] = useState({id: null, isAdmin: false, loggedIn: false});
  const [mapId, setMapId] = useState(); // Add mapId state

// console.log("auth context user", user)

  const logInUser = () => {
    setUser({ id: 4, isAdmin: false, loggedIn: true });

  };

  const logInAdmin = () => {
    setUser({ id: 1, isAdmin: true, loggedIn: true });
  };

  const logOut = () => {
    setUser({ id: null, loggedIn: false });
    setMapId(undefined); // Reset mapId state on logout
  };

  // console.log("user in AuthContext", user)

return (
  <AuthContext.Provider value={{ user, logInUser, logInAdmin, logOut, mapId, setMapId }}>
    {children}
  </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);
