import axios from 'axios';


const BACKEND = process.env.REACT_APP_API_URL;


export const deactivateRide = async (id, auth, rides, setRides, setConfirmDelete, isRideCreatedByUser, setRideStatusUpdated) => {

  try {
    const userId = auth.userId;
    const rideCreatedBy = rides.find(ride => ride.id === id).createdby;

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`
      }
    });

    await axiosPrivate.post(`${BACKEND}/ride/deactivate/${id}`, {
      data: { userId, rideCreatedBy, isRideCreatedByUser, auth }
    });

    if (!auth.isAdmin) {
      setRides(prevRides => {
        return prevRides.filter(ride => ride.id !== id);
      });
    } else {
      setRideStatusUpdated(prev => !prev)
    }


    setConfirmDelete(false);
  } catch (error) {
    console.error(error);
  }
};

export const removeFromMyRides = async (id, user, rides, setRides, auth) => {
  try {
    const userId = user.id;

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`
      }
    });

    await axiosPrivate.delete(`${BACKEND}/rides/delete/users/${id}`, {
      data: { userId }
    });
    setRides(prevRides => prevRides.filter(ride => ride.id !== id));
  } catch (error) {
    console.error(error);
  }
};

export const deleteRide = async (id, user, setRides) => {
  try {
    const userId = user.id;

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${user?.accessToken}`
      }
    });

    await axiosPrivate.delete(`${BACKEND}/rides/delete/${id}`, {
      data: { userId, user }
    });
    setRides(prevRides => prevRides.filter(ride => ride.id !== id));
  } catch (error) {
    console.error(error);
  }
};