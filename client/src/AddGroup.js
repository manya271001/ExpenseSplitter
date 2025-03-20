import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addGroup } from "./redux/groupSlice ";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";


const AddGroup = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);
  const [groupName, setGroupName] = useState("");
  const [maxMembers, setMaxMembers] = useState(10);
  const [description, setDescription] = useState("");
  const [totalBalance, setTotalBalance] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [memberIds, setMemberIds] = useState([userId]);


  const resetForm = () => {
    setGroupName("");
    setMaxMembers(10);
    setTotalBalance(0);
    setDescription("");
    setIsActive(true);
    setMemberIds([userId]);
  };

  const handleAddGroup = async () => {
    if (!groupName.trim()) return alert("Group name cannot be empty.");
    if (!userId) return alert("Please login to create a group.");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5102/api/group/createGroup",
        {
          name: groupName,
          createdBy: userId,
          maxMembers: maxMembers,
          totalBalance: totalBalance,
          isActive: isActive,
          description: description,
          memberIds,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200 || response.status === 201) {
        dispatch(addGroup(response.data.group));
        alert("Group created successfully!");
        resetForm();
        handleClose();
         

      } else {
        alert("Failed to create group. Please try again.");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      alert(error.response?.data?.message || "Error creating group.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Group Name</Form.Label>
            <Form.Control
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Max Members</Form.Label>
            <Form.Control
              type="number"
              value={maxMembers}
              onChange={(e) => setMaxMembers(Number(e.target.value))}
              min="1"
              max="50"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Total Balance</Form.Label>
            <Form.Control
              type="number"
              value={totalBalance}
              onChange={(e) => setTotalBalance(Number(e.target.value))}
              min="0"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter group description"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Is Active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Member IDs (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              value={memberIds.join(",")}
              onChange={(e) =>
                setMemberIds(e.target.value.split(",").map((id) => Number(id.trim())))
              }

              placeholder="Enter member IDs separated by commas"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAddGroup}>
          Create Group
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddGroup;
