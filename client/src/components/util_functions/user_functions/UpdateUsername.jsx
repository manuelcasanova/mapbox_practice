import axios from "axios";

export const updateUsername = async (auth, newUsername) => {
  // Define the URL of your backend endpoint
  const url = "http://localhost:3500/users/modifyusername";

  
  // Prepare the data to be sent in the request body
  const data = {
    userId: auth.userId, 
    newUsername: newUsername
  };

  try {
    console.log("here ")
    // Make a POST request to the backend API
    const response = await axios.post(url, data);
    // console.log("Username updated successfully:", response.data);

    // Assuming the backend returns the updated user object, return it
    return response.data.user; // Adjust the property name based on the actual response structure
  } catch (error) {
    console.error("Error updating username:", error);
    // Handle errors, such as displaying error messages to the user
    throw error; // Re-throw the error to propagate it to the caller
  }
};


