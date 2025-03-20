import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaUserPlus, FaUser, FaIdBadge, FaUsers } from "react-icons/fa";
import "./InviteModal.css";
import axios from "axios";


const InviteModal = () => {
  const location = useLocation();
  const { groupId } = location.state || {};

  const [formData, setFormData] = useState({
    userId: "",
    username: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   const handleSendInvite = async () => {
    if (!groupId || !formData.userId || !formData.username) {
      alert("Please fill all fields before sending the invite.");
      return;
    }

    const requestData = {
      groupId: groupId,
      invitedUserId: parseInt(formData.userId), // Convert to number
      invitedUserName: formData.username,
    };

    try {
      const response = await axios.post(
        "http://localhost:5102/api/invitations/send",
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      alert(response.data.message); // Show success message
        setFormData({ userId: "", username: "" }); // Clear form
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send invitation.");
    }
  };

  return (
    <div className="invite-container">
      <div className="invite-form">
        <h2>
          <FaUserPlus /> Send Invitation
        </h2>

        <div className="input-group">
          <label><FaUsers /> Group ID:</label>
          <input type="text" value={groupId || ""} readOnly />
        </div>

        <div className="input-group">
          <label><FaIdBadge /> User ID:</label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            placeholder="Enter User ID"
          />
        </div>

        <div className="input-group">
          <label><FaUser /> Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter Username"
          />
        </div>

        <button className="send-btn" onClick={handleSendInvite}>
          <FaUserPlus /> Send Invite
        </button>
      </div>
    </div>
  );
};

export default InviteModal;
