// src/store/findingsApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearUserInfo } from "./authSlice";

const BASE_URL = "http://localhost:8081";

// 1. Create the standard fetchBaseQuery
const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
});

// 2. Wrap it to handle 401 responses
const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  console.log(result)
  if (result.error && result.error.status === 401) {
    api.dispatch(clearUserInfo());
    window.location.href = 'http://localhost:5173/login';
  }
  return result;
};

export const findingsApi = createApi({
  reducerPath: "findingsApi",
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({
    getFindings: builder.query({
      // ADDED/CHANGED FOR MULTI-TENANCY:
      // we accept tenantId, toolType, etc.
      query: ({ tenantId, toolType, severity, state, page, size }) => {
        const params = new URLSearchParams();
        if (tenantId) params.set("tenantId", tenantId);
        if (toolType) params.set("toolType", toolType);
        if (severity) params.set("severity", severity);
        if (state) params.set("state", state);
        if (page !== undefined) params.set("page", page);
        if (size !== undefined) params.set("size", size);
        return `findings?${params.toString()}`;
      },
    }),
    // For scanning, we can now pass tenantId
    triggerScan: builder.mutation({
      query: ({ tenantId, tools }) => ({
        url: `/scan/publish?tenantId=${tenantId}`,
        method: "POST",
        body: {
          tenantId, 
          tools,
        },
      }),
    }),

    getAlertStatesAndReasons: builder.query({
      query: () => 'alert/states-reasons'
    }),

    updateAlertState: builder.mutation({
      query: ({ tenantId,     
        alertNumber: number,
        newState,
        reason,
        toolType }) => {
        // We'll put tenantId in the query param, and the rest in the body
        return {
          url: `/alert/updateState?tenantId=${tenantId}`,
          method: 'POST',
          body: {
            tenantId,     
            alertNumber: number,
            newState,
            reason,
            toolType
          }
        };
      }
    }),
  }),
});

export const { 
  useLazyGetFindingsQuery,
  useTriggerScanMutation,
  useGetAlertStatesAndReasonsQuery,
  useUpdateAlertStateMutation,
} = findingsApi;
