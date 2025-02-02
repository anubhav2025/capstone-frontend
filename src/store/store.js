// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { findingsApi } from "./findingsApi";

export const store = configureStore({
  reducer: {
    // Add the RTK Query reducer
    [findingsApi.reducerPath]: findingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(findingsApi.middleware),
});
