import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  groups: [],  
  groupCount:0,
  status: "idle",
  error: null,
};

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setGroups: (state, action) => {
      state.groups = action.payload.groups;  
      state.groupCount = action.payload.numberOfGroups;  

      localStorage.setItem("groupCount", action.payload.numberOfGroups);  // ✅ Save count to localStorage
    },
    addGroup: (state, action) => {
      if (!state.groups) state.groups = []; // ✅ Ensure groups is an array
      state.groups.push(action.payload); 
      state.groupCount += 1;  

      localStorage.setItem("groupCount", state.groupCount);  
    },
    removeGroup: (state, action) => {
      state.groups = state.groups.filter((group) => group.id !== action.payload);
      state.groupCount -= 1;  

      localStorage.setItem("groupCount", state.groupCount);  // ✅ Save to localStorage
    },
  },
});

export const { setGroups, addGroup, removeGroup } = groupSlice.actions;
export default groupSlice.reducer;

// ✅ Fetch groups & store in localStorage
export const fetchGroups = (userId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await axios.get(`http://localhost:5102/api/group/userGroups/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("API Response:", response.data);  // ✅ Log API response

    dispatch(setGroups(response.data)); 
  } catch (error) {
    console.error("Error fetching groups:", error);
  }
};





// ✅ Thunk action to create a group
export const createGroup = (groupData) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const { user } = getState(); // Get user from Redux state
    if (!user || !user.id) return;

    const response = await axios.post(
      "http://localhost:5102/api/group/createGroup",
      { ...groupData, createdBy: user.id }, // Assign user ID from Redux
      { headers: { Authorization: `Bearer ${token}` } }
    );

    dispatch(addGroup(response.data.group)); // Update Redux state
  } catch (error) {
    console.error("Error adding group:", error);
  }
};

// ✅ Thunk action to delete a group
export const deleteGroup = (groupId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    await axios.delete(`http://localhost:5102/api/group/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(removeGroup(groupId)); // Update Redux state
  } catch (error) {
    console.error("Error deleting group:", error);
  }
};
