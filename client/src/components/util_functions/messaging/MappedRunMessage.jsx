

import DeleteRunMessage from "./DeleteRunMessage"
import ReportInappropiateRunMessage from './DeleteRunMessage'
import FlagInappropiateRunMessage from './FlagInappropiateRunMessage'
import AdminOkReportedRunMessage from './AdminOkReportedMessage'

export default function MappedRunMessage({ message, user, setMessageDeleted, setMessageReported, setMessageFlagged }) {

  return (
    <div key={message.id} style={{ borderBottom: "1px solid #ccc" }}>
      {message.status !== "flagged" && <p>{message.message}</p>}
      {message.status === "flagged" && user.isAdmin && <p>{message.message}</p>}
      <p>Message by: {message.createdby}</p>
      <p>Message time: {message.createdat}</p>
      {message.createdby === user.id && (
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