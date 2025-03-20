import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const Id = useSelector((state) => state.user.id);

  useEffect(() => {
    console.log("Current userId:", Id); // Debugging userId

    if (Id) {
      fetch(`http://localhost:5102/api/invitations/pending/${Id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Raw API Response:", data); // Log full response
          if (data?.$values) {
            console.log("Extracted Invitations:", data.$values); // Log extracted invitations
            setInvitations(data.$values);
          } else {
            console.warn("Unexpected API response format:", data);
            setInvitations([]);
          }
        })
        .catch((error) => console.error("Error fetching invitations:", error));
    }
  }, [Id]);

  const handleResponse = (invitationId, isAccepted) => {
    fetch("http://localhost:5102/api/invitations/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invitationId, isAccepted }),
    })
      .then((response) => response.json())
      .then(() => {
        setInvitations((prevInvitations) =>
          prevInvitations.filter((inv) => inv.id !== invitationId)
        );
        return fetch(`http://localhost:5102/api/invitations/pending/${Id}`);
      })
      .then((response) => response.json())
      .then((data) => setInvitations(data))
      .catch((error) => console.error("Error responding to invitation:", error));
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "20px auto",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Pending Invitations</h2>
      {invitations.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd", backgroundColor: "#f4f4f4" }}>
                Group Name
              </th>
              <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd", backgroundColor: "#f4f4f4" }}>
                Created By
              </th>
              <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd", backgroundColor: "#f4f4f4" }}>
                Invited User
              </th>
              <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd", backgroundColor: "#f4f4f4" }}>
                Created At
              </th>
              <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd", backgroundColor: "#f4f4f4" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((inv) => (
              <tr key={inv.id}>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{inv.groupName}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{inv.createdByName}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{inv.invitedUserName}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{new Date(inv.createdAt).toLocaleString()}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  <button
                    style={{
                      backgroundColor: "#4caf50",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                      marginRight: "5px",
                    }}
                    onClick={() => handleResponse(inv.id, true)}
                  >
                    Accept
                  </button>
                  <button
                    style={{
                      backgroundColor: "#ff5252",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleResponse(inv.id, false)}
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending invitations.</p>
      )}
    </div>
  );
};

export default Invitations;
