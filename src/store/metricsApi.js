// src/features/metricsApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearUserInfo } from './authSlice';

const BASE_URL = 'http://localhost:8081';

// 1. Create the standard fetchBaseQuery
const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // If you are sending cookies
});

// 2. Wrap it to handle 401 (unauthorized) responses
const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  // Send the request first
  const result = await rawBaseQuery(args, api, extraOptions);
  console.log(result.error)

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

export const metricsApi = createApi({
  reducerPath: 'metricsApi',
  // baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: 'include' }),
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({
    getToolDistribution: builder.query({
      query: () => '/metrics/tool-distribution', // GET
    }),
    getStateDistribution: builder.query({
      query: (toolType) => `/metrics/state-distribution?toolType=${toolType}`,
    }),
    getSeverityDistribution: builder.query({
      query: (toolType) => `/metrics/severity-distribution?toolType=${toolType}`,
    }),
    getCvssHistogram: builder.query({
        query: () => '/metrics/cvss-histogram'
      }),
    getUserDetails: builder.query({
      query: () => '/user/me',
    })
  }),
});

export const { 
  useGetToolDistributionQuery,
  useGetStateDistributionQuery,
  useGetSeverityDistributionQuery,
  useGetCvssHistogramQuery,
  useGetUserDetailsQuery
} = metricsApi;
