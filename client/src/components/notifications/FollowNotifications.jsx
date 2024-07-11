//Libraries, dependencies
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

//Hooks
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Fontawesome
import { faCircleXmark, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function FollowNotifications() {
  const axiosPrivate = useAxiosPrivate()
  const BACKEND = process.env.REACT_APP_API_URL;
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [followNotifications, setFollowNotifications] = useState(false)
  const [showFollowNotifications, setShowFollowNotifications] = useState(true)

  const fetchFollowNotifications = async (auth, setFollowNotifications, setIsLoading, setError, isMounted) => {

    if (Object.keys(auth).length !== 0) {

      try {
        const response = await axiosPrivate.get(`${BACKEND}/users/follownotifications`, {
          params: {
            user: auth.userId
          }

        });
        if (isMounted) {
          if (response.data) {
            setFollowNotifications(response.data);
          } else {
            throw new Error('Empty response data');
          }
          setIsLoading(false);
          setError(null);
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
      setIsLoading(false);
    }

  };

  useEffect(() => {
    let isMounted = true;
    fetchFollowNotifications(auth, setFollowNotifications, setIsLoading, setError, isMounted)
    return () => {
      isMounted = false;
    };
  }, [auth]);

  const handleClick = () => {
    navigate("/users/pending")
    setShowFollowNotifications(false);
  };

  const handleDismiss = () => {
    setShowFollowNotifications(false);
  }

  return (
    <>
      {followNotifications.length ? (
        auth && showFollowNotifications &&
        <div className="notifications-container">
          <div className="notifications-buttons">
            <button
              className="orange-button"
              onClick={handleClick}
            >
              <FontAwesomeIcon
                className="faBell-follow-request"
                icon={faBell} />
              Follow requests
            </button>
            <button
              className="red-button"
              onClick={handleDismiss}
            >
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
          </div>
        </div>

      ) : <></>}

    </>
  );


}




