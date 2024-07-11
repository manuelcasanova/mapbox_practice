//Libraries
import axios from 'axios';

const BACKEND = process.env.REACT_APP_API_URL;

export const activateUser = async (user, loggedInUser, auth) => {
  try {
    const userId = user.id;
    const isUserLoggedIn = loggedInUser.accessToken !== null;

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`
      }
    });

    await axiosPrivate.post(`${BACKEND}/user/activate/${userId}`, {
      userId, isUserLoggedIn
    });


  } catch (error) {
    console.error(error);
  }
};

export const deactivateUser = async (user, loggedInUser, auth) => {

  try {
    const userId = user.id || user.userId;
    const isUserLoggedIn = loggedInUser.accessToken !== null;

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`
      }
    });

    await axiosPrivate.post(`${BACKEND}/user/deactivate/${userId}`, {
      userId, isUserLoggedIn
    });



  } catch (error) {
    console.error(error);
  }
};


export const deleteUser = async (userObject, user, setUsers, loggedInUser, auth) => {
  try {
    const userId = user.id;

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`
      }
    });

    await axiosPrivate.delete(`${BACKEND}/user/delete/${userId}`, {
      data: { userId, user, loggedInUser, userObject }
    });


    setUsers(prevUsers => {
      return prevUsers.filter(user => user.id !== userId);
    });

  } catch (error) {
    console.error(error);
  }
};