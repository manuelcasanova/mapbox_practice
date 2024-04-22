import DeleteRideMessage from "./DeleteRideMessage"
import ReportInappropiateMessage from "./ReportInappropiateMessage"
import FlagInapropiateMessage from "./FlagInappropiateMessage"

export default function MappedMessage({ message, user, setMessageDeleted, setMessageReported, setMessageFlagged }) {

  return (
    <div key={message.id} style={{ borderBottom: "1px solid #ccc" }}>
      <p>{message.message}</p>
      <p>Message by: {message.createdby}</p>
      <p>Message time: {message.createdat}</p>
      {message.createdby === user.id && (
        <DeleteRideMessage messageId={message.id} setMessageDeleted={setMessageDeleted} />
      )}

      {message.status === "reported" ? <div>Reported. Pending review.</div> :
        (message.createdby !== user.id &&
          <ReportInappropiateMessage messageId={message.id} setMessageReported={setMessageReported} />
        )
      }

      {user.isAdmin && message.createdby !== user.id && (
        <FlagInapropiateMessage messageId={message.id} setMessageFlagged={setMessageFlagged} />
      )}
    </div>
  )
}