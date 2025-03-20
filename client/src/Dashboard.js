import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "./redux/userSlice";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import AddGroup from "./AddGroup";
import { Modal, Button } from "react-bootstrap";
import { fetchGroups } from "./redux/groupSlice ";
import DeleteGroup from "./DeleteGroup";
import './App.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [actionType, setActionType] = useState("");

  const [totalOwed, setTotalOwed] = useState(0);
  const [totalReceivable, setTotalReceivable] = useState(0);

  const user = useSelector((state) => state.user);
  const userId = useSelector((state) => state.user.id);
  const { groupCount } = useSelector((state) => state.groups);

  useEffect(() => {
    if (userId) {
      dispatch(fetchGroups(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) return;
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `http://localhost:5102/api/auth/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        dispatch(setUser(response.data));
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [dispatch, userId]);

  useEffect(() => {
    const fetchUserBalances = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(
          `http://localhost:5102/api/expenses/user/${userId}/balances`
        );
        setTotalOwed(response.data.totalOwed);
        setTotalReceivable(response.data.totalReceivable);
      } catch (error) {
        console.error("Error fetching user balances:", error);
      }
    };

    fetchUserBalances();
  }, [userId]);

  const handleAddGroupClick = () => {
    if (!userId) {
      setActionType("create a group");
      setShowAuthPopup(true);
    } else {
      setShowAddModal(true);
    }
  };

  const [userGroups, setUserGroups] = useState([]);

  const handleRemoveGroupClick = async () => {
    if (!userId) {
      setActionType("remove a group");
      setShowAuthPopup(true);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5102/api/group/createdBy/${userId}`
      );

      setUserGroups(response.data?.$values || []);
      setShowDeleteModal(true);
    } catch (error) {
      console.error("Error fetching user's groups:", error);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!groupId) return;

    try {
      const response = await axios.delete(
        `http://localhost:5102/api/group/deleteGroup/${groupId}/${userId}`
      );

      if (response.status === 200) {
        setUserGroups((prevGroups) =>
          prevGroups.filter((group) => group.id !== groupId)
        );

        if (userGroups.length === 1) setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  return (
    <div className="container py-4">
      <div
        className="text-white text-center p-4 rounded"
        style={{ backgroundColor: "paleturquoise", fontStyle: "italic" }}
      >
        <h2 className="mb-0" style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)"}}>Hello, {userId ? user.name : "Guest"} 👋</h2>
      </div>

<div className="row mt-4">
  <div className="col-md-4">
    <div className="box amount-lent text-white p-4 rounded text-center">
      <p className="fw-bold">Amount Lent</p>
      <p className="fs-4">₹{totalReceivable}</p>
    </div>
  </div>
  <div className="col-md-4">
    <div className="box amount-owed text-white p-4 rounded text-center">
      <p className="fw-bold">Amount Owed</p>
      <p className="fs-4">₹{totalOwed}</p>
    </div>
  </div>
  <div className="col-md-4">
    <div className="box groups-joined text-white p-4 rounded text-center">
      <p className="fw-bold">Groups Joined</p>
      <p className="fs-4">{groupCount}</p>
    </div>
  </div>
</div>


      <div className="d-flex justify-content-center gap-3 mt-4">
        <button className="btn btn-primary" onClick={handleAddGroupClick}>
          Add Group
        </button>
        <button
          className="btn btn-outline-secondary px-4 py-2"
          onClick={handleRemoveGroupClick}
        >
          Remove Group
        </button>
      </div>

      {/* Add Group Modal */}
      <AddGroup show={showAddModal} handleClose={() => setShowAddModal(false)} />

      {/* Delete Group Modal */}
      <DeleteGroup
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        groups={userGroups}
        handleDelete={handleDeleteGroup}
      />

      {/* Authentication Required Popup */}
      <Modal show={showAuthPopup} onHide={() => setShowAuthPopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Authentication Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You must be logged in to {actionType}. Please log in or register to continue.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAuthPopup(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => navigate("/register")}>
            Login / Register
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
