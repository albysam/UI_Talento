import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const workingDayApi = createApi({
  reducerPath: "workingDayApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://talentsapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["WorkingDays"],
  endpoints: (builder) => ({
    getWorkingDays: builder.query({
      query: ({ searchString }) => ({
        url: `workingDay?searchString=${searchString}`,
      }),
      providesTags: (result, error, { searchString }) => [
        {
          type: "WorkingDays" as const,
          searchString,
        },
      ],
    }),
    getWorkingDayById: builder.query({
      query: (id) => ({
        url: `workingDay/${id}`,
      }),
      providesTags: ["WorkingDays"],
    }),
    createWorkingDay: builder.mutation({
      query: (data) => ({
        url: "workingDay",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["WorkingDays"],
    }),
    updateWorkingDay: builder.mutation({
      query: ({ data, id }) => ({
        url: "workingDay/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["WorkingDays"],
    }),
    deleteWorkingDay: builder.mutation({
      query: (id) => ({
        url: "workingDay/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["WorkingDays"],
    }),
  }),
});

  
  export const {
    useGetWorkingDaysQuery,
    useGetWorkingDayByIdQuery,
    useCreateWorkingDayMutation,
    useUpdateWorkingDayMutation,
    useDeleteWorkingDayMutation,
  } = workingDayApi;
  export default workingDayApi;
  