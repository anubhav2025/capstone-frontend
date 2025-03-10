// src/store/runbookApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// ...other imports

export const runbookApi = createApi({
  reducerPath: "runbookApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8081", credentials: 'include', }),
  tagTypes: ["Runbook"],
  endpoints: (builder) => ({
    // 1) getRunbooksForTenant
    getRunbooksForTenant: builder.query({
      query: (tenantId) => `/runbooks?tenantId=${tenantId}`,
      providesTags: ["Runbook"],
    }),

    // 2) createRunbook
    createRunbook: builder.mutation({
      query: (body) => ({
        url: "/runbooks/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Runbook"],
    }),

    // 3) setRunbookEnabled
    setRunbookEnabled: builder.mutation({
      query: ({ runbookId, enable }) => ({
        url: `/runbooks/${runbookId}/enable?enable=${enable}`,
        method: "PUT",
      }),
      invalidatesTags: ["Runbook"],
    }),

    // 4) configureTriggers
    configureTriggers: builder.mutation({
      query: (body) => ({
        url: `/runbooks/configure-triggers`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Runbook"],
    }),
    // 4b) getTriggersForRunbook
    getTriggersForRunbook: builder.query({
      query: (runbookId) => `/runbooks/${runbookId}/triggers`,
      providesTags: ["Runbook"],
    }),

    // 5) configureFilters
    configureFilters: builder.mutation({
      query: (body) => ({
        url: `/runbooks/configure-filters`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Runbook"],
    }),
    // 5b) getFiltersForRunbook
    getFiltersForRunbook: builder.query({
      query: (runbookId) => `/runbooks/${runbookId}/filters`,
      providesTags: ["Runbook"],
    }),

    // 6) configureActions
    configureActions: builder.mutation({
      query: (body) => ({
        url: `/runbooks/configure-actions`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Runbook"],
    }),
    // 6b) getActionsForRunbook
    getActionsForRunbook: builder.query({
      query: (runbookId) => `/runbooks/${runbookId}/actions`,
      providesTags: ["Runbook"],
    }),
    getAvailableTriggers: builder.query({
        // adjust the URL if your backend is different
        query: () => '/runbooks/available-triggers',
    }),
    deleteRunbook: builder.mutation({
        query: (runbookId) => ({
          url: `/runbooks/${runbookId}`,
          method: "DELETE",
        }),
    }),
  }),
});

// Now export the auto-generated hooks
export const {
  useGetRunbooksForTenantQuery,
  useCreateRunbookMutation,
  useSetRunbookEnabledMutation,
  useConfigureTriggersMutation,
  useGetTriggersForRunbookQuery,
  useConfigureFiltersMutation,
  useGetFiltersForRunbookQuery,
  useConfigureActionsMutation,
  useGetActionsForRunbookQuery, // <-- THIS is critical
  useGetAvailableTriggersQuery,
  useDeleteRunbookMutation,
} = runbookApi;
