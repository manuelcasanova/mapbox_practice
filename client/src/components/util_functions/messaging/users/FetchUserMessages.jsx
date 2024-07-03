import axios from 'axios';

const fetchUserMessages = async (auth, userForMessages, messages, setMessages) => {
  //  console.log("rideId fetchRideMessage", rideId)
  const BACKEND = process.env.REACT_APP_API_URL;
  try {

    
    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}` // Assuming auth.token is the JWT token
      }
    });
    const response = await axiosPrivate.get(`${BACKEND}/users/messages/read`, {
      params: {
        userForMessages: userForMessages,
        user: auth
      }
    });
    setMessages(response.data)
      // console.log("response.data in fetchUserMessages", response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching user messages:', error);
    return [];
  }
};

export default fetchUserMessages;
