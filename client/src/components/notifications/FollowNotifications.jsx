//Libraries, dependencies

import axios from "axios";

//Hooks

import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 

export default function FollowNotifications () {
  const BACKEND = process.env.REACT_APP_API_URL;
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [followNotifications, setFollowNotifications] = useState(false)
  const [showFollowNotifications, setShowFollowNotifications] = useState(true)

    //  console.log("auth in FOllowNotifications", auth)


  const fetchFollowNotifications = async (auth, setFollowNotifications, setIsLoading, setError, isMounted) => {

    //  console.log("auth in fetchFollowNotifications", auth)

    if (Object.keys(auth).length !== 0)  {

    try {
      const response = await axios.get(`${BACKEND}/users/follownotifications`, {
        params: {
          user: auth.userId 
        }
    
      });
      //  console.log("response in fetchFN", response.data)
      if (isMounted) {
        if (response.data) {
          setFollowNotifications(response.data);
        } else {
          throw new Error('Empty response data');
        }
        setIsLoading(false);
        setError(null); // Clear any previous errors
      }
    } catch (error) {
      if (isMounted) {
        if (error.response && error.response.data && error.response.data.error) {
          setError(error.response.data.error)
        } else {
          setError(error.message)
        }
        setIsLoading(false);
      }
    }

  } else {
    // Handle case when auth is empty
    setIsLoading(false);
    // setError('Auth data is missing');
}

  };

  useEffect(() => {
    let isMounted = true;
    // console.log("useEffect fetchFollowNotifications")
    fetchFollowNotifications(auth, setFollowNotifications, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [auth]);

  const handleClick = () => {
    setShowFollowNotifications(false);
  };

  return (
    <>
 
      {followNotifications.length ? (
           auth && showFollowNotifications &&
        <Link 
        to="/users/pending"
        onClick={handleClick}
        >
          Notification: New follow requests.
          </Link>
           
      ) : <></>}

    </>
  );
  

}




