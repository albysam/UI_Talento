// useDepartments.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const departmentApi = createApi({
  reducerPath: "departmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://talentsapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  endpoints: (builder) => ({
    getDepartments: builder.query({
      query: ({ searchString }) => ({
        url: `department?searchString=${searchString}`,
      }),
    }),
  }),
});

export const useGetDepartments = departmentApi.endpoints.getDepartments.useQuery;
export default departmentApi;
