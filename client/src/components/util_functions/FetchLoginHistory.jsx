import axios from "axios";

const fetchLoginHistory = async (auth, setLoginHistory, setIsLoading, setError, isMounted) => {
  try {

    if (!auth || Object.keys(auth).length === 0) {
      throw new Error("Login to access this area.");
    }
    // console.log("fetching loging history")
    const response = await axios.get('http://localhost:3500/users/loginhistory', { 
      params: {
        user: auth 
      }
    });
    if (isMounted) {
      // console.log("rd", response.data)
    setLoginHistory(response.data)
    setIsLoading(false)
    // console.log("Login History fetched")
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

export default fetchLoginHistory