import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const attendenceUserApi = createApi({
  reducerPath: "attendenceUserApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://talentsapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["AttendenceUsers"],
  endpoints: (builder) => ({
    getAttendenceUsers: builder.query({
      query: ({ searchString }) => ({
        url: `attendenceUser?searchString=${searchString}`,
      }),
      providesTags: (result, error, { searchString }) => [
        {
          type: "AttendenceUsers" as const,
          searchString,
        },
      ],
    }),
  
    getAggregatedAttendences: builder.query({
      query: ({ searchString }) => ({
        url: `attendenceUser/Aggregated?searchString=${searchString}`,
      }),
      providesTags: (result, error, { searchString }) => [
        {
          type: "AttendenceUsers" as const,
          searchString,
        },
      ],
    }),



   
  }),
});

  
  export const {
    useGetAttendenceUsersQuery,
    useGetAggregatedAttendencesQuery,
  } = attendenceUserApi;
  export default attendenceUserApi;
  