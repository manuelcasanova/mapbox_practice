import axios from 'axios';

const fetchUserMessages = async (user, userForMessages, messages, setMessages) => {
  //  console.log("rideId fetchRideMessage", rideId)
  try {
    const response = await axios.get(`http://localhost:3500/users/messages`, {
      params: {
        userForMessages: userForMessages,
        user: user
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
