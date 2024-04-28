import axios from 'axios';

export const deactivateRide = async (id, user, rides, setRides, setConfirmDelete, isRideDreatedByUser) => {
  try {
    const userId = user.id;
    const rideCreatedBy = rides.find(ride => ride.id === id).createdby;
    await axios.post(`http://localhost:3500/ride/deactivate/${id}`, {
      data: { userId, rideCreatedBy, isRideDreatedByUser }
    });

    setRides(prevRides => {
      // Filter out the ride that has been removed
      return prevRides.filter(ride => ride.id !== id);
    });

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
