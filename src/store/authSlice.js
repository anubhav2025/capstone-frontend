// src/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// 1) Retrieve user info from localStorage if available
const storedUserInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userInfo: storedUserInfo,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo(state, action) {
      // 2) Update Redux state
      state.userInfo = action.payload;

      // 3) Persist to localStorage
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    clearUserInfo(state) {
      state.userInfo = null;
      localStorage.removeItem("userInfo"); // remove from storage on logout
    },
  },
});

export const { setUserInfo, clearUserInfo } = authSlice.actions;
export default authSlice.reducer;
