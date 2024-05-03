import axios from "axios";

const fetchUsernameAndId = async (user, setUsers, setIsLoading, setError, isMounted) => {
// console.log("user in FetchUsername", user.username)
  try {
    const response = await axios.get('http://localhost:3500/users/names', {
      params: {
        user: user
      }
  
    });
    if (isMounted) {
      // console.log("response.data", response.data)
      setUsers(response.data);
      // console.log("users in fetch nameid", response.data)
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

export default fetchUsernameAndId