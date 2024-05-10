import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const holidayApi = createApi({
  reducerPath: "holidayApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://talentsapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["Holidays"],
  endpoints: (builder) => ({
    getHolidays: builder.query({
      query: ({ searchString }) => ({
        url: `holiday?searchString=${searchString}`,
      }),
      providesTags: (result, error, { searchString }) => [
        {
          type: "Holidays" as const,
          searchString,
        },
      ],
    }),
    getHolidayById: builder.query({
      query: (id) => ({
        url: `holiday/${id}`,
      }),
      providesTags: ["Holidays"],
    }),
    createHoliday: builder.mutation({
      query: (data) => ({
        url: "holiday",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Holidays"],
    }),
    updateHoliday: builder.mutation({
      query: ({ data, id }) => ({
        url: "holiday/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Holidays"],
    }),
    deleteHoliday: builder.mutation({
      query: (id) => ({
        url: "holiday/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Holidays"],
    }),
  }),
});

  
  export const {
    useGetHolidaysQuery,
    useGetHolidayByIdQuery,
    useCreateHolidayMutation,
    useUpdateHolidayMutation,
    useDeleteHolidayMutation,
  } = holidayApi;
  export default holidayApi;
  