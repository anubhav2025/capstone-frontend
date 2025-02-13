// src/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// 1) Retrieve user info from localStorage if available
const storedUserInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  // userInfo might look like:
  // {
  //   googleId, email, name, roles, tenants: [...],
  //   currentTenantId: "T1"  <-- we'll store tenant ID here
  // }
  userInfo: storedUserInfo,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo(state, action) {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    clearUserInfo(state) {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },

    // ADDED/CHANGED FOR MULTI-TENANCY:
    // Instead of storing a separate field, we update userInfo.currentTenantId
    setTenantId(state, action) {
      if (!state.userInfo) {
        // If there's no user info, create an empty object
        state.userInfo = {};
      }
      state.userInfo.currentTenantId = action.payload;
      // persist to localStorage
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
    },
  },
});

export const { setUserInfo, clearUserInfo, setTenantId } = authSlice.actions;
export default authSlice.reducer;
