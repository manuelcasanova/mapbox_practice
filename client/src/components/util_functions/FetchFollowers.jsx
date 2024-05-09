import axios from "axios";

const fetchFollowers = async (auth, setFollowers, setIsLoading, setError, isMounted) => {
  try {
    const response = await axios.get('http://localhost:3500/users/followers', { 
      params: {
        user: auth 
      }
    });
    if (isMounted) {
      console.log("response.data fetchFollowers", response.data)
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