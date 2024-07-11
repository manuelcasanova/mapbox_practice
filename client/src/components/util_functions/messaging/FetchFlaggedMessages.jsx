import axios from 'axios';

const fetchFlaggedMessages = async ({auth}) => {
  const BACKEND = process.env.REACT_APP_API_URL;
  const isAdmin = auth.isAdmin
  try {

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`
      }
    });

    const response = await axiosPrivate.get(`${BACKEND}/rides/messages/flagged`, {
    params: {
      isAdmin: isAdmin
    }
  });
    return response.data;
  } catch (error) {
    console.error('Error fetching flagged messages:', error);
    return [];
  }
};

export default fetchFlaggedMessages;
