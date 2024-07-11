import axios from "axios";

const fetchFollowers = async (auth, setFollowers, setIsLoading, setError, isMounted) => {
  const BACKEND = process.env.REACT_APP_API_URL;

  try {
    if (!auth || Object.keys(auth).length === 0) {
      throw new Error("Login to access this area.");
    }

    // Create an Axios instance with private configuration
    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`
      }
    });

    const response = await axiosPrivate.get("/users/followers", {
      params: {
        user: auth
      }
    });

    if (isMounted) {
      setFollowers(response.data);
      setIsLoading(false);
    }
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

export default fetchFollowers;
