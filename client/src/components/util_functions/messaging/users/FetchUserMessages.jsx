import axios from 'axios';

const fetchUserMessages = async (auth, userForMessages, messages, setMessages) => {
  const BACKEND = process.env.REACT_APP_API_URL;
  try {

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`
      }
    });
    const response = await axiosPrivate.get(`${BACKEND}/users/messages/read`, {
      params: {
        userForMessages: userForMessages,
        user: auth
      }
    });
    setMessages(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching user messages:', error);
    return [];
  }
};

export default fetchUserMessages;
