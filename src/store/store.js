// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { findingsApi } from "./findingsApi";
import { metricsApi } from "./metricsApi";
import { runbookApi } from "./runbookApi";
import authReducer from "./authSlice";

// NEW: import ticketApi
import { ticketApi } from "./ticketApi";

export const store = configureStore({
  reducer: {
    [findingsApi.reducerPath]: findingsApi.reducer,
    [metricsApi.reducerPath]: metricsApi.reducer,
    [ticketApi.reducerPath]: ticketApi.reducer, // <--- Add this
    [runbookApi.reducerPath]: runbookApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(findingsApi.middleware)
      .concat(metricsApi.middleware)
      .concat(ticketApi.middleware) // <--- And this
      .concat(runbookApi.middleware),
});
