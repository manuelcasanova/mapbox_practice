import axios from "axios";

const fetchFriendships = async (user, setUsers, friendships, setFriendships, setIsLoading, setError, isMounted) => {
  try {
    const response = await axios.get('http://localhost:3500/users/friendships', { 
      params: {
        user: user 
      }
     
    });
    // console.log("response", response)
    if (isMounted) {
      setFriendships(response.data); //change for setFriendships
    }
    setIsLoading(false);
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

export default fetchFriendships