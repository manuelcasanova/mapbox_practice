import axios from "axios";

const fetchFollowee = async (auth, setFollowers, setIsLoading, setError, isMounted) => {
  
  // console.log("auth in FetchFollowee", auth)
  
  try {

    if (!auth || Object.keys(auth).length === 0) {
      throw new Error("User authentication information is missing.");
    }

    const response = await axios.get('http://localhost:3500/users/followee', { 
      params: {
        user: auth 
      }
    });
    if (isMounted) {
      // console.log("response data FetchFollowee", response.data)
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

export default fetchFollowee