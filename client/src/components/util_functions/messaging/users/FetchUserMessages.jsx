import axios from 'axios';

const fetchUserMessages = async (sender, receiver, messages, setMessages) => {
  //  console.log("rideId fetchRideMessage", rideId)
  try {
    const response = await axios.get(`http://localhost:3500/users/messages`, {
      params: {
        sender: sender,
        receiver: receiver
      }
    });
    setMessages(response.data)
      console.log("response.data in fetchUserMessages", response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching user messages:', error);
    return [];
  }
};

export default fetchUserMessages;
