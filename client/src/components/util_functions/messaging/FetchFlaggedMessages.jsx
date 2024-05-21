import axios from 'axios';

const fetchFlaggedMessages = async ({auth}) => {
  // console.log("auth", auth)
  const BACKEND = process.env.REACT_APP_API_URL;
  const isAdmin = auth.isAdmin
  try {
    const response = await axios.get(`${BACKEND}/rides/messages/flagged`, {
    params: {
      isAdmin: isAdmin
    }
  });
    //  console.log("response.data", response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching flagged messages:', error);
    return [];
  }
};

export default fetchFlaggedMessages;
