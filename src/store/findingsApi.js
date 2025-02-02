// src/features/findingsApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base URL of your backend
const BASE_URL = "http://localhost:8081";

export const findingsApi = createApi({
  reducerPath: "findingsApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    // 1) GET /findings with query params
    getFindings: builder.query({
      query: ({ toolType, severity, state, page, size }) => {
        // Construct query string
        const params = new URLSearchParams();
        if (toolType) params.set("toolType", toolType);
        if (severity) params.set("severity", severity);
        if (state) params.set("state", state);
        // pagination defaults
        if (page !== undefined) params.set("page", page);
        if (size !== undefined) params.set("size", size);

        return `findings?${params.toString()}`;
      },
    }),

    // 2) POST /scan/publish
    triggerScan: builder.mutation({
      query: () => ({
        url: "scan/publish",
        method: "POST",
        // if the endpoint needs a body, provide it here,
        // but presumably it's empty or has a JSON object
        body: {
          owner: "anubhav2025",
          repository: "juice-shop",
          username: "anubhav2025",
          tools: ["ALL"],
        },
      }),
    }),
  }),
});

// Export RTK Query hooks
export const { useGetFindingsQuery, useTriggerScanMutation } = findingsApi;
