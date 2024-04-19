import { createContext, useState, useContext, useEffect } from "react";
import axios from 'axios';
// import Now from "../Now";


// Create a context for authentication
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState({ id: null, isAdmin: false, isSuperAdmin: false, loggedIn: false, username: null, lastlogin: null });
  const [mapId, setMapId] = useState(); // Add mapId state

  const now = new Date();
  const localTime = new Date(now.getTime() - (7 * 3600000));


  // Function to perform axios request to update lastlogin in the backend
  const updateUserLastLogin = async (user) => {
    try {
      const response = await axios.post(`http://localhost:3500/users/lastlogin/`, {
        userId: user.id,
         lastlogin: localTime 
      });
      // console.log("User last login updated successfully", response.data);
    } catch (error) {
      console.error("Error updating user last login", error);
    }
  };

  useEffect(() => {
    if (user.loggedIn) {
      updateUserLastLogin(user);
    }
  }, [user.loggedIn]);

  const logInUser1 = () => {
    setUser({ id: 1, isAdmin: true, isSuperAdmin: true, loggedIn: true, username: 'Manuel', lastlogin: localTime });
  };

  const logInUser2 = () => {
    setUser({ id: 2, isAdmin: true, isSuperAdmin: false, loggedIn: true, username: 'Laura', lastlogin: localTime });
  };

  const logInUser3 = () => {
    setUser({ id: 3, isAdmin: false, isSuperAdmin: false, loggedIn: true, username: 'Alice', lastlogin: localTime });
};

  const logInUser4 = () => {
    setUser({ id: 4, isAdmin: false, isSuperAdmin: false, loggedIn: true, username: 'Bob', lastlogin: localTime });
};

  const logInUser5 = () => {
    setUser({ id: 5, isAdmin: false, isSuperAdmin: false, loggedIn: true, username: 'Emma', lastlogin: localTime });
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
