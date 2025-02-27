// src/store/ticketApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:8081";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  return result;
};

export const ticketApi = createApi({
  reducerPath: "ticketApi",
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({
    getAllTickets: builder.query({
      query: (tenantId) => `/tickets?tenantId=${tenantId}`,
    }),
    createTicket: builder.mutation({
      query: ({ tenantId, findingId, summary, description }) => ({
        url: "/tickets/create",
        method: "POST",
        body: { tenantId, findingId, summary, description },
      }),
    }),
    updateTicketToDone: builder.mutation({
      query: ({ tenantId, ticketId }) => ({
        url: `/tickets/${ticketId}/done?tenantId=${tenantId}`,
        method: "PUT",
      }),
    }),
    getTicketById: builder.query({
      query: ({ tenantId, ticketId }) =>
        `/tickets/${ticketId}?tenantId=${tenantId}`,
    }),
  }),
});

export const {
  useGetAllTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketToDoneMutation,
  useGetTicketByIdQuery,
} = ticketApi;
