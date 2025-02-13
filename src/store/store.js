// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { findingsApi } from "./findingsApi";
import { metricsApi } from "./metricsApi";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    [findingsApi.reducerPath]: findingsApi.reducer,
    [metricsApi.reducerPath]: metricsApi.reducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(findingsApi.middleware)
      .concat(metricsApi.middleware),
});
