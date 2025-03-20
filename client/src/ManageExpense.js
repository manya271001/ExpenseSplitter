import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './ManageExpense.css'; // Import CSS file for styling

function ManageExpense() {
  const [expenses, setExpenses] = useState([]);
  const [paymentFlows, setPaymentFlows] = useState([]); // State for payment flows data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { groupId } = useParams(); // Extract groupId from URL

  // Function to format amount to 3 decimal places
  const formatAmount = (amount) => {
    return amount.toFixed(3); // Limit to 3 decimal places
  };

  // Fetch expenses and payment flows concurrently
  useEffect(() => {
    const fetchExpensesAndPaymentFlows = async () => {
      try {
        setLoading(true);

        // Run both API calls in parallel using Promise.all
        const [expensesResponse, paymentFlowsResponse] = await Promise.all([
          axios.get(`http://localhost:5102/api/expenses/group/${groupId}`),
          axios.get(`http://localhost:5102/api/expenses/group/${groupId}/totalExpense`)
        ]);

        // Log the response data to check the structure
        console.log("Expenses Response:", expensesResponse.data);
        console.log("Payment Flows Response:", paymentFlowsResponse.data);

        // Extract the $values from the response correctly
        const expensesData = expensesResponse.data?.$values || [];
        const paymentFlowsData = paymentFlowsResponse.data?.$values || []; // Use $values to get the actual payment flow data

        console.log("Extracted Payment Flows Data:", paymentFlowsData);

        setExpenses(expensesData);
        setPaymentFlows(paymentFlowsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpensesAndPaymentFlows();
  }, [groupId]); // Re-fetch if groupId changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Calculate total amounts to receive and owe for each user
  const calculateAmounts = () => {
    const userOwedAmounts = {};

    paymentFlows.forEach((payment) => {
      // Track money owed to a user (payee) and by a user (payer)
      if (!userOwedAmounts[payment.payee]) {
        userOwedAmounts[payment.payee] = { totalReceive: 0, totalPay: 0 };
      }
      if (!userOwedAmounts[payment.payer]) {
        userOwedAmounts[payment.payer] = { totalReceive: 0, totalPay: 0 };
      }

      userOwedAmounts[payment.payee].totalReceive += payment.amount;
      userOwedAmounts[payment.payer].totalPay += payment.amount;
    });

    return userOwedAmounts;
  };

  const userAmounts = calculateAmounts();

  // Function to determine who a user is paying
  const getPaymentDetails = (userId) => {
    const userPaymentFlows = paymentFlows.filter((flow) => flow.payer === userId);
    if (userPaymentFlows.length === 0) {
      return "Pays No One"; // User does not owe anything to anyone
    }
    return userPaymentFlows.map((flow) => `${flow.payee}: ₹${formatAmount(flow.amount)}`).join(", ");
  };

  // Get unique users (payers and payees)
  const allUsers = [
    ...new Set(paymentFlows.map((flow) => flow.payer).concat(paymentFlows.map((flow) => flow.payee)))
  ];

  // Function to check if a user has no payment flow
  const hasPaymentFlow = (userId) => {
    return paymentFlows.some((flow) => flow.payer === userId || flow.payee === userId);
  };

  return (
    <div className="expense-container">
      <h2>Manage Expenses for Group {groupId}</h2>

      {/* First table: Expenses table */}
      <table className="expense-table">
        <thead>
          <tr>
            <th>Paid By</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.user ? expense.user.name : "Unknown"}</td>
              <td>{formatAmount(expense.amount)}</td>
              <td>{expense.category}</td>
              <td>{new Date(expense.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Second table: Payment flow and total amounts owed/received */}
      <h3>Payment Flow Summary</h3>
      <table className="expense-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Total Paid</th>
            <th>Total to Receive</th>
            <th>Total owned</th>
            <th>Payment Flow</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.length > 0 ? (
            allUsers.map((userId) => {
              // Make sure to display each user only once
              const { totalReceive, totalPay } = userAmounts[userId] || {};
              const paymentDetails = getPaymentDetails(userId);

              // If the user is part of any transaction, show the data
              return (
                <tr key={userId}>
                  <td>{userId}</td>
                  <td>{formatAmount(totalPay)}</td>
                  <td style={{ color: "green"  }}>{formatAmount(totalPay)}</td>
                  <td style={{ color: "red" }}>
                    {formatAmount(totalReceive)}
                  </td>
                  <td>{paymentDetails}</td> {/* Display payment details */}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">No payment flow data available.</td>
            </tr>
          )}
          {/* Users without any payment flow (like Anshita) */}
          {allUsers.filter(userId => !hasPaymentFlow(userId)).map((userId) => (
            <tr key={userId}>
              <td>{userId}</td>
              <td>0</td>
              <td>0</td>
              <td>{formatAmount(userAmounts[userId]?.totalReceive || 0)}</td>
              <td>No One</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageExpense;
