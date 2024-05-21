import axios from 'axios';

const BACKEND = process.env.REACT_APP_API_URL;

export const deactivateRun = async (id, auth, runs, setRuns, setConfirmDelete, isRunCreatedByUser, setRunStatusUpdated) => {

  try {
    // console.log("setRunsStatusUpdated", setRunsStatusUpdated)
    // console.log("auth in deactivateRun", auth)
    const userId = auth.userId;
    const runCreatedBy = runs.find(run => run.id === id).createdby;
    await axios.post(`${BACKEND}/run/deactivate/${id}`, {
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

export const removeFromMyRuns = async (id, user, runs, setRuns) => {
  try {
    const userId = user.id;
    await axios.delete(`${BACKEND}/runs/delete/users/${id}`, {
      data: { userId }
    });
    setRuns(prevRuns => prevRuns.filter(run => run.id !== id));
  } catch (error) {
    console.error(error);
  }
};

export const deleteRun = async (id, user, setRuns) => {
  try {
    const userId = user.id;
    await axios.delete(`${BACKEND}/runs/delete/${id}`, {
      data: { userId, user }
    });
    setRuns(prevRuns => prevRuns.filter(run => run.id !== id));
  } catch (error) {
    console.error(error);
  }
};