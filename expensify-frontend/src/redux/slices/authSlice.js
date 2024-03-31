import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    isAuthenticated: false,
  },

  reducers: {
    getUser(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    removeUser(state) {
      (state.user = {}), (state.isAuthenticated = false);
    },
  },
});

export const { getUser, removeUser } = authSlice.actions;
export default authSlice.reducer;
