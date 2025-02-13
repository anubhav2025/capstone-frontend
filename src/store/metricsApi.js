// src/store/metricsApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearUserInfo } from './authSlice';

const BASE_URL = 'http://localhost:8081';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
});

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  console.log(result);
  // if (result.error && result.error.status === 401) {
  //   api.dispatch(clearUserInfo());
  //   window.location.href = 'http://localhost:5173/login';
  // }
  return result;
};

export const metricsApi = createApi({
  reducerPath: 'metricsApi',
  baseQuery: baseQueryWithInterceptor,
  endpoints: (builder) => ({
    // ADDED/CHANGED FOR MULTI-TENANCY:
    // If your backend needs ?tenantId=xxx in these queries, handle similarly:
    getToolDistribution: builder.query({
      query: (currentTenantId) => {
        let url = '/metrics/tool-distribution';
        console.log(currentTenantId)
        if (currentTenantId) {
          
          url += `?tenantId=${currentTenantId}`;
        }
        return url;
      },
    }),
    getStateDistribution: builder.query({
      query: ({ tenantId, toolType }) => {
        let url = `/metrics/state-distribution?toolType=${toolType}`;
        if (tenantId) {
          url += `&tenantId=${tenantId}`;
        }
        return url;
      },
    }),
    getSeverityDistribution: builder.query({
      query: ({ tenantId, toolType }) => {
        let url = `/metrics/severity-distribution?toolType=${toolType}`;
        if (tenantId) {
          url += `&tenantId=${tenantId}`;
        }
        return url;
      },
    }),
    getCvssHistogram: builder.query({
      query: (tenantId) => {
        let url = '/metrics/cvss-histogram';
        if (tenantId) {
          url += `?tenantId=${tenantId}`;
        }
        return url;
      },
    }),
    getUserDetails: builder.query({
      query: () => '/user/me',
    }),
  }),
});

export const { 
  useGetToolDistributionQuery,
  useGetStateDistributionQuery,
  useGetSeverityDistributionQuery,
  useGetCvssHistogramQuery,
  useGetUserDetailsQuery
} = metricsApi;
