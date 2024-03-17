import { createContext, useState, useContext, useEffect } from "react";

// Create a context for authentication
const AuthContext = createContext();

export const AuthProvider = ({children}) => {


  const [user, setUser] = useState({id: null, isAdmin: false, isSuperAdmin: false, loggedIn: false, username: null});
  const [mapId, setMapId] = useState(); // Add mapId state

//  useEffect (() => {
//   console.log("user authentication jsx", user)
//  })

  const logInUser1 = () => {
    setUser({ id: 1, isAdmin: true, isSuperAdmin: true, loggedIn: true, username: 'Manuel' });
  };

  const logInUser2 = () => {
    setUser({ id: 2, isAdmin: true, isSuperAdmin: false, loggedIn: true, username: 'Laura' });
  };

  const logInUser3 = () => {
    setUser({ id: 3, isAdmin: false, isSuperAdmin: false, loggedIn: true, username: 'Alice' });
  };

  const logInUser4 = () => {
    setUser({ id: 4, isAdmin: false, isSuperAdmin: false, loggedIn: true, username: 'Bob' });
  };

  const logInUser5 = () => {
    setUser({ id: 5, isAdmin: false, isSuperAdmin: false, loggedIn: true, username: 'Emma' });
  };

  const logOut = () => {
    setUser({ id: null, loggedIn: false });
    setMapId(undefined); // Reset mapId state on logout
  };

  // console.log("user in AuthContext", user)

return (
  <AuthContext.Provider value={{ user, logInUser1, logInUser2, logInUser3, logInUser4, logInUser5, logOut, mapId, setMapId }}>
    {children}
  </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);
