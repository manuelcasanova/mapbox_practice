import axios from "axios";

const fetchMutedUsers = async (auth, userLoggedin, isLoggedIn, setMutedUsers, setIsLoading, setError, isMounted) => {
  const BACKEND = process.env.REACT_APP_API_URL;
  try {

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}` // Assuming auth.token is the JWT token
      }
    });

    const response = await axiosPrivate.get(`${BACKEND}/users/muted`, { params: { userId: userLoggedin, isLoggedIn: isLoggedIn } });
    // console.log("muted users in FetchMutedUsers", response.data.mutedUsers)
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
