import { configureStore } from '@reduxjs/toolkit';
import noteReducer from '../state_slices/noteSlice.js';
import appReducer from '../state_slices/appSlice.js';
import userReducer from '../state_slices/userSlice.js';

export const store = configureStore({
  reducer: {
    note: noteReducer,
    app: appReducer,
    user: userReducer,
  },
});
