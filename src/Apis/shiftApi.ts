import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const shiftApi = createApi({
  reducerPath: "shiftApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://talentsapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["Shifts"],
  endpoints: (builder) => ({
    getShifts: builder.query({
      query: ({ searchString }) => ({
        url: `shift?searchString=${searchString}`,
      }),
      providesTags: (result, error, { searchString }) => [
        {
          type: "Shifts" as const,
          searchString,
        },
      ],
    }),
    getShiftById: builder.query({
      query: (id) => ({
        url: `shift/${id}`,
      }),
      providesTags: ["Shifts"],
    }),
    createShift: builder.mutation({
      query: (data) => ({
        url: "shift",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Shifts"],
    }),
    updateShift: builder.mutation({
      query: ({ data, id }) => ({
        url: "shift/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Shifts"],
    }),
    deleteShift: builder.mutation({
      query: (id) => ({
        url: "shift/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Shifts"],
    }),
  }),
});

  
  export const {
    useGetShiftsQuery,
    useGetShiftByIdQuery,
    useCreateShiftMutation,
    useUpdateShiftMutation,
    useDeleteShiftMutation,
  } = shiftApi;
  export default shiftApi;
  