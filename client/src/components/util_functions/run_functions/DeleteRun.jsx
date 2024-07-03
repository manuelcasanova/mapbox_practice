import axios from 'axios';


const BACKEND = process.env.REACT_APP_API_URL;


export const deactivateRun = async (id, auth, runs, setRuns, setConfirmDelete, isRunCreatedByUser, setRunStatusUpdated) => {

  try {
    // console.log("setRunsStatusUpdated", setRunsStatusUpdated)
    // console.log("auth in deactivateRun", auth)
    const userId = auth.userId;
    const runCreatedBy = runs.find(run => run.id === id).createdby;

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}` // Assuming auth.token is the JWT token
      }
    });
    await axiosPrivate.post(`${BACKEND}/run/deactivate/${id}`, {
      data: { userId, runCreatedBy, isRunCreatedByUser, auth }
    });

   if (!auth.isAdmin) {
    setRuns(prevRuns => {
      // Filter out the ride that has been removed
      return prevRuns.filter(run => run.id !== id);
    });
   } else {
    setRunStatusUpdated(prev => !prev)
   }


    setConfirmDelete(false);
  } catch (error) {
    console.error(error);
  }
};

export const removeFromMyRuns = async (id, user, runs, setRuns, auth) => {
  try {
    const userId = user.id;

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}` // Assuming auth.token is the JWT token
      }
    });
    await axiosPrivate.delete(`${BACKEND}/runs/delete/users/${id}`, {
      data: { userId }
    });
    setRuns(prevRuns => prevRuns.filter(run => run.id !== id));
  } catch (error) {
    console.error(error);
  }
};

export const deleteRun = async (id, user, setRuns, auth) => {
  try {
    const userId = user.id;

    const axiosPrivate = axios.create({
      baseURL: BACKEND,
      headers: {
        Authorization: `Bearer ${auth?.accessToken}` // Assuming auth.token is the JWT token
      }
    });

    await axiosPrivate.delete(`${BACKEND}/runs/delete/${id}`, {
      data: { userId, user }
    });
    setRuns(prevRuns => prevRuns.filter(run => run.id !== id));
  } catch (error) {
    console.error(error);
  }
};