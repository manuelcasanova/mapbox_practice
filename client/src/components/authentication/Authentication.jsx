import { useState } from "react";
import { useLocation, useNavigate } from "react-router";


const Authentication = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({});

  const logInUser = () => {
    setUser({ id: 5, isAdmin: false, loggedIn: true });

  };

  const logInAdmin = () => {
    setUser({ id: 1, isAdmin: true, loggedIn: true });
  };

  const logOut = () => {
    setUser({ id: null, loggedIn: false });
  };

console.log("user", user)

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
