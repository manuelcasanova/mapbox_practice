import { useState } from "react";
import { useAuth } from '../Context/AuthContext';

const Authentication = () => {


  const { user, logInUser, logInAdmin, logOut } = useAuth();


// console.log("user", user)

  return (
<div>
  {user.loggedIn && (
    <div>
      <>Logged in as {user.id}</>
      <button className="button-logout" onClick={logOut}>
        Log Out
      </button>
    </div>
  )}
  {!user.loggedIn && (
  
    <div className="log-user-buttons">
      <button className="button-login" onClick={logInUser}>
        Log In as User
      </button>
      <button className="button-login" onClick={logInAdmin}>
        Log In As Admin
      </button>
    </div>
  )}
</div>

  );
};

export default Authentication;
