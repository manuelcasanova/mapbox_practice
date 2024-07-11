import axios from "axios";

const fetchPendingUsers = async (auth, userLoggedin, isLoggedIn, setPendingUsers, setIsLoading, setError, isMounted) => {
  const BACKEND = process.env.REACT_APP_API_URL;
  try {

    if (!auth || Object.keys(auth).length === 0) {
      throw new Error("Login to access this area.");
    }

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`
      }
    });

    const response = await axiosPrivate.get(`${BACKEND}/users/pending`, { params: { userId: userLoggedin, isLoggedIn: isLoggedIn } });
    setPendingUsers(response.data.pendingUsers);
  } catch (error) {
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

export default fetchPendingUsers;
