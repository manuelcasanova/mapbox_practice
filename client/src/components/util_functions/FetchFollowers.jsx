import axios from "axios";

const fetchFollowers = async (auth, setFollowers, setIsLoading, setError, isMounted) => {

  const BACKEND = process.env.REACT_APP_API_URL;

  try {

    if (!auth || Object.keys(auth).length === 0) {
      throw new Error("Login to access this area.");
    }
    
    const response = await axios.get(`${BACKEND}/users/followers`, { 
      params: {
        user: auth 
      }
    });
    if (isMounted) {
      // console.log("response.data fetchFollowers", response.data)
      setFollowers(response.data); 
      setIsLoading(false);
    }
  } catch (error) {
    if (isMounted) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error)
      } else {
        setError(error.message)
      }
      setIsLoading(false);
    }
  }
};

export default fetchFollowers