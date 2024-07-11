import { createContext, useState } from "react";
import axios from 'axios';
import useAxiosPrivate from "../hooks/useAxiosPrivate";


const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [mapId, setMapId ] = useState()
    const BACKEND = process.env.REACT_APP_API_URL;
    const axiosPrivate = useAxiosPrivate()

      const updateUsername = async (newUsername) => {
        try {
  
          const url = `${BACKEND}/users/modifyusername`;
  
          const data = {
            userId: auth.userId,
            newUsername: newUsername
          };
    
          const response = await axiosPrivate.post(url, data);
    
          setAuth((prevAuth) => ({
            ...prevAuth,
            username: newUsername
          }));
    
          return response.data.user;
        } catch (error) {
          console.error("Error updating username:", error);
          throw error; 
        }
      };

    return (
        <AuthContext.Provider value={{ auth, setAuth, mapId, setMapId, updateUsername }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;