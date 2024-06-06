import DeleteRideMessage from "./DeleteRideMessage"
import ReportInappropiateMessage from "./ReportInappropiateMessage"
import FlagInapropiateMessage from "./FlagInappropiateMessage"
import AdminOkReportedMessage from "./AdminOkReportedMessage"
import fetchUsernameAndId from "../FetchUsername"

//Styles
import '../../../styles/RidesMessaging.css'

import { useEffect, useState } from "react"

import useAuth from "../../../hooks/useAuth"

export default function MappedMessage({ message, user, setMessageDeleted, setMessageReported, setMessageFlagged }) {

  const auth = useAuth()
  const userId = auth.auth.userId;
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');



  const originalDate = new Date(message.createdat);

  const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const formattedDate = `${originalDate.getDate()}-${monthAbbreviations[originalDate.getMonth()]}-${originalDate.getFullYear()} at ${originalDate.getHours().toString().padStart(2, '0')}:${originalDate.getMinutes().toString().padStart(2, '0')}:${originalDate.getSeconds().toString().padStart(2, '0')}`;

  useEffect(() => {
    let isMounted = true;
    async function getUsername() {
      setIsLoading(true);
      setError('');
      try {
        const userData = await fetchUsernameAndId(auth, setUsers, setIsLoading, setError, isMounted);
      } catch (error) {
        if (isMounted) {
          setError('Failed to fetch username');
          setIsLoading(false);
        }
      }
    }
    getUsername();
    return () => {
      isMounted = false;
    };
  }, [message.createdby]);

  // console.log("users", users)

  // console.log("message createdby", message.createdby)
  // console.log("user.id", user.id)

  // Find the username corresponding to the message.createdby ID
  const createdByUsername = users.find(user => user.id === message.createdby)?.username || 'Unknown User';

  return (
    <div
      key={message.id}
      className="mapped-messages-container"
    >

      <div className="mapped-messages-name-and-message">
        <div className="mapped-messages-username">{createdByUsername}</div>


        {message.status !== "flagged" && <div>{message.message}</div>}


        {message.status === 'flagged' && message.createdby !== userId && (
          <div>
            <div className='flagged-inappropiate-message'>Message concealed due to inappropiate content.
            </div>
          </div>
        )}

        {message.status === 'flagged' && message.createdby === userId && (
          <div>
            <div className='flagged-inappropiate-message'>Message concealed due to inappropiate content. Not visible for other users.
            </div>
          </div>
        )}


        {/* {console.log("message in mapped mesage.jsx", message)} */}


        {message.status === "flagged" && user.isAdmin && <div>{message.message}</div>}
      </div>

      <div className="mapped-messages-date">{formattedDate}</div>

<div className="mapped-messages-users-buttons">

      {message.createdby === user.userId && (
        <DeleteRideMessage messageId={message.id} setMessageDeleted={setMessageDeleted} />
      )}

      {(message.status !== "reported") && (message.status !== "flagged") && (message.createdby !== user.id) && <ReportInappropiateMessage messageId={message.id} setMessageReported={setMessageReported} user={user} />}

      </div>


      <div className="mapped-messages-admin-buttons">

      {message.status === "reported" && <div className="mapped-messages-reported">Message reported as inappropiate. Pending review.</div>}

        {(message.status === "flagged" && user.isAdmin) && 
        <>
         <div className="mapped-messages-reported">&nbsp;Approve message&nbsp;</div>
        <AdminOkReportedMessage messageId={message.id} setMessageReported={setMessageReported} />
        </>
        }

        {(message.status === "reported") && user.isAdmin && 
        <>
          <div className="mapped-messages-reported">&nbsp;Approve/conceal message&nbsp;</div>
        <AdminOkReportedMessage messageId={message.id} setMessageReported={setMessageReported} />
        </>
        }

        {(message.status === "reported") && user.isAdmin && <FlagInapropiateMessage messageId={message.id} setMessageFlagged={setMessageFlagged} />}
      </div>

    </div>
  )
}