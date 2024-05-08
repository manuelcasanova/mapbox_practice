//Libraries, dependencies

import axios from "axios";

//Hooks

import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 

export default function FollowNotifications () {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [followNotifications, setFollowNotifications] = useState(false)

    //  console.log("auth in FOllowNotifications", auth)


  const fetchFollowNotifications = async (auth, setFollowNotifications, setIsLoading, setError, isMounted) => {

    try {
      const response = await axios.get('http://localhost:3500/users/follownotifications', {
        params: {
          user: auth.userId 
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
    fetchFollowNotifications(auth, setFollowNotifications, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false; // Cleanup function to handle unmounting
    };
  }, [auth]);

  return (
    <>
 
      {followNotifications.length ? (
           auth.accessToken &&
        <Link to="/users/pending">
          Notification: New follow requests.
          </Link>
           
      ) : <></>}

    </>
  );
  

}




