import axios from 'axios';

export const deactivateRide = async (id, user, rides, setRides, setConfirmDelete, isRideCreatedByUser, setRideStatusUpdated) => {
  try {
    // console.log("setRidestatusupdated", setRideStatusUpdated)
    const userId = user.id;
    const rideCreatedBy = rides.find(ride => ride.id === id).createdby;
    await axios.post(`http://localhost:3500/ride/deactivate/${id}`, {
      data: { userId, rideCreatedBy, isRideCreatedByUser, user }
    });

   if (!user.isAdmin) {
    setRides(prevRides => {
      // Filter out the ride that has been removed
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

export const removeFromMyRides = async (id, user, rides, setRides) => {
  try {
    const userId = user.id;
    await axios.delete(`http://localhost:3500/rides/delete/users/${id}`, {
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
    await axios.delete(`http://localhost:3500/rides/delete/${id}`, {
      data: { userId, user }
    });
    setRides(prevRides => prevRides.filter(ride => ride.id !== id));
  } catch (error) {
    console.error(error);
  }
};