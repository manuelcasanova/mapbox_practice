import DeleteRideMessage from "./DeleteRideMessage"
import ReportInappropiateMessage from "./ReportInappropiateMessage"
import FlagInapropiateMessage from "./FlagInappropiateMessage"
import AdminOkReportedMessage from "./AdminOkReportedMessage"

export default function MappedMessage({ message, user, setMessageDeleted, setMessageReported, setMessageFlagged }) {
// console.log("message createdby", message.createdby)
// console.log("user.id", user.id)
  return (
    <div key={message.id} style={{ borderBottom: "1px solid #ccc" }}>
      {message.status !== "flagged" && <p>{message.message}</p>}
      {message.status === "flagged" && user.isAdmin && <p>{message.message}</p>}
      <p>Message by: {message.createdby}</p>
      <p>Message time: {message.createdat}</p>
      {message.createdby === user.userId && (
        <DeleteRideMessage messageId={message.id} setMessageDeleted={setMessageDeleted} />
      )}

{message.status === "reported" && <div>Reported. Pending review.</div>}

{(message.status !== "reported") && (message.status !== "flagged") && (message.createdby !== user.id) &&  <ReportInappropiateMessage messageId={message.id} setMessageReported={setMessageReported} user={user} /> }
     

{(message.status === "flagged" && user.isAdmin) &&       <AdminOkReportedMessage messageId={message.id} setMessageReported={setMessageReported} />}

{(message.status === "reported") &&  user.isAdmin &&     <AdminOkReportedMessage messageId={message.id} setMessageReported={setMessageReported} />}

{(message.status === "reported") &&  user.isAdmin &&     <FlagInapropiateMessage messageId={message.id} setMessageFlagged={setMessageFlagged} />}


    </div>
  )
}