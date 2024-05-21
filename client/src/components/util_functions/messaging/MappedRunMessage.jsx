import DeleteRunMessage from "./DeleteRunMessage"
import ReportInappropiateRunMessage from './ReportInappropiateRunMessage'
import FlagInappropiateRunMessage from './FlagInappropiateRunMessage'
import AdminOkReportedRunMessage from './AdminOkReportedRunMessage'
import fetchUsernameAndId from "../FetchUsername"

import { useEffect, useState } from "react"

import useAuth from "../../../hooks/useAuth"

export default function MappedRunMessage({ message, user, setMessageDeleted, setMessageReported, setMessageFlagged }) {

  const auth = useAuth()
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // console.log(message.createdat)

  const originalDate = new Date(message.createdat);

  const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const formattedDate = `${originalDate.getDate()}-${monthAbbreviations[originalDate.getMonth()]}-${originalDate.getFullYear()} at ${originalDate.getHours().toString().padStart(2, '0')}:${originalDate.getMinutes().toString().padStart(2, '0')}:${originalDate.getSeconds().toString().padStart(2, '0')}`;

// console.log(formattedDate);


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

  // Find the username corresponding to the message.createdby ID
const createdByUsername = users.find(user => user.id === message.createdby)?.username || 'Unknown User';

  return (
    <div key={message.id} >

      <p>{createdByUsername}</p>
      <p>{formattedDate}</p>
      {/* {message.createdby === user.userId && (
        <DeleteRunMessage messageId={message.id} setMessageDeleted={setMessageDeleted} />
      )} */}
      {message.status !== "flagged" && <p>{message.message}</p>}
      {message.status === "flagged" && user.isAdmin && <p>{message.message}</p>}
      {message.createdby === user.userId && (
        <DeleteRunMessage messageId={message.id} setMessageDeleted={setMessageDeleted} />
      )}
 

{message.status === "reported" && <div>Reported. Pending review.</div>}

{(message.status !== "reported") && (message.status !== "flagged") && (message.createdby !== user.id) &&  <ReportInappropiateRunMessage messageId={message.id} setMessageReported={setMessageReported} user={user} /> }
     

{(message.status === "flagged" && user.isAdmin) &&       <AdminOkReportedRunMessage messageId={message.id} setMessageReported={setMessageReported} />}

{(message.status === "reported") &&  user.isAdmin &&     <AdminOkReportedRunMessage messageId={message.id} setMessageReported={setMessageReported} />}

{(message.status === "reported") &&  user.isAdmin &&     <FlagInappropiateRunMessage messageId={message.id} setMessageFlagged={setMessageFlagged} />}


    </div>
  )
}