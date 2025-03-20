import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  name: "",
  email: "",
  initialBalance: 0,
  hasSetup: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    logout: () => {
      return { ...initialState };
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
