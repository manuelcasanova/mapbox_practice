import axios from "axios";

const fetchMutedUsers = async (userLoggedin, isLoggedIn, setMutedUsers, setIsLoading, setError, isMounted) => {
  const BACKEND = process.env.REACT_APP_API_URL;
  try {
    const response = await axios.get(`${BACKEND}/users/muted`, { params: { userId: userLoggedin, isLoggedIn: isLoggedIn } });
    setMutedUsers(response.data.mutedUsers);
  } catch (error) {
    console.error('Error fetching muted users:', error);
    if (isMounted) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError(error.message);
      }
      setIsLoading(false);
    }
  }
};

export default fetchMutedUsers;
