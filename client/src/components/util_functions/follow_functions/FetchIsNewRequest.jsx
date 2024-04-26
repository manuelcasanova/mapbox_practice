// util_functions/FetchIsNewRequest.js

const fetchIsNewRequest = (pendingUsersObject, loginhistory) => {
  // Sort the login history array by login time in descending order
  loginhistory.sort((a, b) => new Date(b.login_time) - new Date(a.login_time));

  let isNewRequest = false;

  // Check if there are at least two login entries
  if (loginhistory.length >= 2) {
    // Extract the second-to-last login time
    const secondToLastLoginTime = new Date(loginhistory[1].login_time);

    // Compare the lastmodification timestamp with the second-to-last login time
    isNewRequest = pendingUsersObject.some(user => user.lastmodification > secondToLastLoginTime);
    
  } else if (loginhistory.length === 1) {
    // If there is only one login entry
    const onlyLoginTime = new Date(loginhistory[0].login_time);
    isNewRequest = pendingUsersObject.some(user => user.lastmodification > onlyLoginTime);
  } else {
    // If there are no login entries
    // console.log('User has no login entries.');
  }

  return isNewRequest;
};

export default fetchIsNewRequest;
