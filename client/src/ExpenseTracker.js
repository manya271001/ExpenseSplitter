import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./ExpenseTracker.css";
import { useNavigate } from "react-router-dom";

const ExpenseTracker = () => {
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const navigate = useNavigate();

  const userId = useSelector((state) => state.user?.id);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`http://localhost:5102/api/group/userGroups/details/${userId}`);
        const groupDetails = response.data.$values || [];

        // Fetch member count for each group
        const groupWithMemberCounts = await Promise.all(
          groupDetails.map(async (group) => {
            const memberCountRes = await axios.get(`http://localhost:5102/api/group/memberCount/${group.id}`);
            return { ...group, memberCount: memberCountRes.data.memberCount };
          })
        );

        setGroups(groupWithMemberCounts);
      } catch (error) {
        console.error("Error fetching user groups:", error);
      }
    };

    fetchGroups();
  }, [userId]);

  const handleAddExpenseClick = (groupId) => {
    setSelectedGroupId(groupId);
    setShowModal(true);
  };

 const handleSubmitExpense = async () => {
  if (!amount || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  try {
    // Mapping the category string to its corresponding enum integer value
    const categoryEnum = {
      Food: 0,
      Travel: 1,
      Shopping: 2,
      Utilities: 3,
      Rent: 4,
      Other: 5,
    };

    const expenseData = {
      groupId: selectedGroupId,
      paidBy: userId,
      amount: parseFloat(amount),
      category: categoryEnum[category],  // Ensure category is sent as an integer
    };

    console.log("Sending expense data:", expenseData);  // Debugging log

    const response = await axios.post("http://localhost:5102/api/expenses/addExpense", expenseData);
    alert("Expense added successfully!");
    setShowModal(false);
    setAmount("");
    setCategory("Food");
  } catch (error) {
    console.error("Error adding expense:", error);
    alert("Failed to add expense.");
  }
};


  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  };

  const modalContentStyle = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
    animation: "fadeIn 0.3s ease-in-out",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "1rem",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s",
  };

  const cancelButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.3s",
  };

  return (
    <div className="expense-tracker-container">
      <h2 className="title">Expense Tracker</h2>
      <div className="groups-list">
        {groups.map((group) => (
          <div key={group.id} className="group-card">
            <h3 className="group-title">{group.name}</h3>
            <p className="group-members">Members: {group.memberCount}</p>

            <button className="add-expense-btn" onClick={() => handleAddExpenseClick(group.id)}>
              Add Expense
            </button>
            <button className="add-expense-btn" onClick={() => navigate(`/expenseManager/${group.id}`)}>Manage Expense</button>

          </div>
        ))}
      </div>

      {/* Expense Modal */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ textAlign: "center", marginBottom: "20px", fontSize: "1.5rem", color: "#333" }}>
              Add Expense
            </h3>
            <label style={{ display: "block", fontSize: "1rem", marginBottom: "5px", color: "#333" }}>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={inputStyle}
            />

            <label style={{ display: "block", fontSize: "1rem", marginBottom: "5px", color: "#333" }}>Category:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Utilities">Utilities</option>
              <option value="Rent">Rent</option>
              <option value="Other">Other</option>
            </select>

            <div className="modal-buttons" style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={handleSubmitExpense} style={buttonStyle}>
                Submit
              </button>
              <button onClick={() => setShowModal(false)} style={cancelButtonStyle}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;
