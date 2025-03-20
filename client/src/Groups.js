import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Groups.css";

function Groups() {
  const userId = useSelector((state) => state.user?.id);
  const [createdGroups, setCreatedGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
 const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:5102/api/group/createdBy/${userId}`)
      .then((response) => {
        setCreatedGroups(response.data?.$values || []);
      })
      .catch((error) => console.error("Error fetching created groups:", error));

    axios
      .get(`http://localhost:5102/api/group/userGroups/details/${userId}`)
      .then((response) => {
        setJoinedGroups(response.data?.$values || []);
      })
      .catch((error) => console.error("Error fetching joined groups:", error));
  }, [userId]);

  const handleDeleteGroup = async (groupId) => {
    if (!groupId) return;
    try {
      const response = await axios.delete(
        `http://localhost:5102/api/group/deleteGroup/${groupId}/${userId}`
      );
      if (response.status === 200) {
        setCreatedGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
      }
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleLeaveGroup = async (groupId) => {
  if (!groupId) return;

  const isConfirmed = window.confirm("Are you sure you want to leave this group?");
  if (!isConfirmed) return; // If the user cancels, do nothing

  try {
    const response = await axios.delete(
      `http://localhost:5102/api/group/leaveGroup/${groupId}/${userId}`
    );

    if (response.status === 200) {
      // Remove group from the joinedGroups list
      setJoinedGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alert(error.response.data.message || "Unable to leave the group.");
    } else {
      console.error("Error leaving group:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  }
};

  return (
    <div className="groups-container">
      <h2 className="heading">Groups Created by You</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Group ID</th>
            <th>Name</th>
            <th>Max Members</th>
            <th>Total Balance</th>
            <th>Is Active</th>
            <th>Delete</th>
            <th>Invite</th>
          </tr>
        </thead>
        <tbody>
          {createdGroups.length > 0 ? (
            createdGroups.map((group) => (
              <tr key={group.id}>
                <td>{group.id}</td>
                <td>{group.name}</td>
                <td>{group.maxMembers}</td>
                <td>{group.totalBalance}</td>
                <td>{group.isActive ? "✅ Active" : "❌ Inactive"}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDeleteGroup(group.id)}>Delete</button>
                </td>
                <td>
                  <button 
                    className="invite-btn" 
                    onClick={()=>navigate('/invite' , { state: { groupId: group.id } })} >
                    Send Invite
                  </button>
                  </td>
                  
                    
                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No groups created yet.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2 className="heading">Groups You Are Part Of</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Group ID</th>
            <th>Name</th>
            <th>Is Active</th>
            <th>Leave</th>
          </tr>
        </thead>
        <tbody>
          {joinedGroups.length > 0 ? (
            joinedGroups.map((group) => (
              <tr key={group.id}>
                <td>{group.id}</td>
                <td>{group.name}</td>
                <td>{group.isActive ? "✅ Active" : "❌ Inactive"}</td>
                <td>
                  <button className="delete-btn"  onClick={()=>handleLeaveGroup(group.id)} style={{backgroundColor:"#8B0000"}}>Leave</button> </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No joined groups.</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
}

export default Groups;
