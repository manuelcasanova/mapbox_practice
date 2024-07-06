import { useState } from "react";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export default function ReportInappropiateRunMessage({ messageId, setMessageReported, user }) {

// console.log("messageId in util func delete run", messageId)

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND = process.env.REACT_APP_API_URL;
  const axiosPrivate = useAxiosPrivate();

  const handleInappropiate = async () => {
    try {
      setIsLoading(true);   

      const response = await axiosPrivate.post(`${BACKEND}/runs/message/report/`, {
        messageId,
        userLoggedInId: user.userId 
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

      if (!response.data) {
        throw new Error("Failed to report message");
      }

      setError("");
      setMessageReported(prev => !prev);
    }
    catch (error) {
      console.error('Error:', error.message);
      setError('An error occurred while reporting the message.');
    } finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
    }
  };

  return (
    <div className="report-innapropiate-message">
      <button 
      className="orange-button small-button"
      onClick={handleInappropiate} disabled={isLoading}>Report</button>
      {isLoading && <div className="loading"></div>}
      {error && <p>{error}</p>}
    </div>
  );
}
