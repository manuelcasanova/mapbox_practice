//Libraries, dependencies

import axios from "axios";

//Hooks

import { useAuth } from "../Context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 

export default function FollowNotifications () {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [followNotifications, setFollowNotifications] = useState(false)

    // console.log("user in FOllow not", user)

  const fetchFollowNotifications = async (user, setFollowNotifications, setIsLoading, setError, isMounted) => {

    try {
      const response = await axios.get('http://localhost:3500/users/follownotifications', {
        params: {
          user: user 
        }
    
      });
      if (isMounted) {
        // console.log("response.data", response.data)
        setFollowNotifications(response.data);
        //  console.log("follow notifications in jsx", response.data)
        setIsLoading(false);
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
  };

  useEffect(() => {
    let isMounted = true;
    fetchFollowNotifications(user, setFollowNotifications, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [user]);

  return (
    <>
 
      {followNotifications.length ? (
           user.loggedIn &&
        <Link to="/users/pending">
          Notification: New follow requests.
          </Link>
           
      ) : <></>}

    </>
  );
  

}




