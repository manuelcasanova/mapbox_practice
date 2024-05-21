import { createContext, useState } from "react";
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [mapId, setMapId ] = useState()
    const BACKEND = process.env.REACT_APP_API_URL;

      // Function to update username (User Profile component)
      const updateUsername = async (newUsername) => {
        try {
          // Define the URL of your backend endpoint
          const url = `${BACKEND}/users/modifyusername`;
    
          // Prepare the data to be sent in the request body
          const data = {
            userId: auth.userId,
            newUsername: newUsername
          };
    
          // Make a POST request to the backend API
          const response = await axios.post(url, data);
    
          // Update the auth object with the new username
          setAuth((prevAuth) => ({
            ...prevAuth,
            username: newUsername
          }));
    
          // Assuming the backend returns the updated user object, return it
          return response.data.user; // Adjust the property name based on the actual response structure
        } catch (error) {
          console.error("Error updating username:", error);
          // Handle errors, such as displaying error messages to the user
          throw error; // Re-throw the error to propagate it to the caller
        }
      };

    return (
        <AuthContext.Provider value={{ auth, setAuth, mapId, setMapId, updateUsername }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;