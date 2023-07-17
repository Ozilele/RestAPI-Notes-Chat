import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    appliedFilters: [],
    appClass: "App",
  },
  reducers: {
    addFilter: (state, action) => {
      state.appliedFilters.push(action.payload);
    },
    resetFilters: (state, action) => {
      state.appliedFilters = [];
    },
    deleteFilter: (state, action) => {
      state.appliedFilters = state.appliedFilters.filter(filter => filter !== action.payload);
    },
    changeAppClass: (state, action) => {
      const newClass = state.appClass === "App" ? "App overlay" : "App";
      state.appClass = newClass;
    }
  }
});

export const { addFilter, deleteFilter, resetFilters, changeAppClass } = appSlice.actions;
export const selectFilters = (state) => state.app.appliedFilters;
export const selectAppClass = (state) => state.app.appClass;

export default appSlice.reducer;