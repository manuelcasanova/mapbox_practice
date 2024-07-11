import { useState } from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export default function AdminOkReportedRunMessage({ messageId, setMessageReported }) {
  const BACKEND = process.env.REACT_APP_API_URL;
  const axiosPrivate = useAxiosPrivate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInappropiate = async () => {
    try {
      setIsLoading(true);

      const response = await axiosPrivate.post(
        `${BACKEND}/runs/message/ok/${messageId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.data) {
        throw new Error("Failed to ok message");
      }

      setError("");
      setMessageReported(prev => !prev);
    } catch (error) {
      console.error("Error:", error.message);
      setError("An error occurred while okying the message.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className="green-button small-button" onClick={handleInappropiate}>
        <FontAwesomeIcon icon={faCheck} />
      </button>
      {error && <p>{error}</p>}
    </>
  );
}
