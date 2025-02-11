// src/features/findingsApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base URL of your backend
const BASE_URL = "http://localhost:8081";

// 1. Create the standard fetchBaseQuery
const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // If you are sending cookies
});

// 2. Wrap it to handle 401 (unauthorized) responses
const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  // Send the request first
  const result = await rawBaseQuery(args, api, extraOptions);
  // console.log(first)

  // Check for error status
  if (result.error && result.error.status === 401) {
    // Option 1: dispatch a logout action if you have one
    // api.dispatch(logout());
    api.dispatch(clearUserInfo());

    // Option 2: directly navigate or reload to the login page
    window.location.href = 'http://localhost:5173/login';
  }

  return result;
};


export const findingsApi = createApi({
  reducerPath: "findingsApi",
  // baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: 'include' }),
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({
    getFindings: builder.query({
      query: ({ toolType, severity, state, page, size }) => {
        const params = new URLSearchParams();
        if (toolType) params.set("toolType", toolType);
        if (severity) params.set("severity", severity);
        if (state) params.set("state", state);
        if (page !== undefined) params.set("page", page);
        if (size !== undefined) params.set("size", size);

        return `findings?${params.toString()}`;
      },
    }),

    triggerScan: builder.mutation({
      query: (selectedTools) => ({
        url: "scan/publish",
        method: "POST",
        body: {
          owner: "anubhav2025",
          repository: "juice-shop",
          username: "anubhav2025",
          tools: selectedTools
        },
      }),
    }),

    getAlertStatesAndReasons: builder.query({
      query: () => 'alert/states-reasons'
    }),

    updateAlertState: builder.mutation({
      query: (body) => ({
        url: 'alert/updateState',
        method: 'POST',
        body
      })
    })
  }),
});

// Export RTK Query hooks
export const { 
  // useGetFindingsQuery,
  useLazyGetFindingsQuery,
  useTriggerScanMutation,
  useGetAlertStatesAndReasonsQuery,
  useUpdateAlertStateMutation,
} = findingsApi;
