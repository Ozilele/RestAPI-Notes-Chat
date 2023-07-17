import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: {},
  },
  reducers: {
    logout: (state, action) => {
      state.data = {}; 
    },
    login: (state, action) => {
      state.data = action.payload;
    }
  }
});

export const { logout, login } = userSlice.actions;
export const selectUser = (state) => state.user.data;
export default userSlice.reducer;
