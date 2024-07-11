import axios from "axios";

export const updateUsername = async (auth, newUsername) => {
  const BACKEND = process.env.REACT_APP_API_URL;
  const url = `${BACKEND}/users/modifyusername`;

  const data = {
    userId: auth.userId,
    newUsername: newUsername
  };

  try {
    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}` 
      }
    });
    const response = await axiosPrivate.post(url, data);

    return response.data.user;
  } catch (error) {
    console.error("Error updating username:", error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};


