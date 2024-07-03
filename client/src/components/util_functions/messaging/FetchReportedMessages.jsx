import axios from 'axios';

const fetchReportedMessages = async ({auth}) => {

  const BACKEND = process.env.REACT_APP_API_URL;
  // console.log("auth", auth)
  const isAdmin = auth.isAdmin
  try {

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}` // Assuming auth.token is the JWT token
      }
    });
    const response = await axiosPrivate.get(`${BACKEND}/rides/messages/reported`, {
    params: {
      isAdmin: isAdmin
    }
  });
    //  console.log("response.data", response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching reported messages:', error);
    return [];
  }
};

export default fetchReportedMessages;
