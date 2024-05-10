import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const leaveApi = createApi({
  reducerPath: "leaveApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://talentsapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["Leaves"],
  endpoints: (builder) => ({
    getLeaves: builder.query({
      query: ({ searchString }) => ({
        url: `leave?searchString=${searchString}`,
      }),
      providesTags: (result, error, { searchString }) => [
        {
          type: "Leaves" as const,
          searchString,
        },
      ],
    }),
    getLeaveById: builder.query({
      query: (id) => ({
        url: `leave/${id}`,
      }),
      providesTags: ["Leaves"],
    }),
    createLeave: builder.mutation({
      query: (data) => ({
        url: "leave",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Leaves"],
    }),
    updateLeave: builder.mutation({
      query: ({ data, id }) => ({
        url: "leave/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Leaves"],
    }),
    deleteLeave: builder.mutation({
      query: (id) => ({
        url: "leave/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Leaves"],
    }),
  }),
});

  
  export const {
    useGetLeavesQuery,
    useGetLeaveByIdQuery,
    useCreateLeaveMutation,
    useUpdateLeaveMutation,
    useDeleteLeaveMutation,
  } = leaveApi;
  export default leaveApi;
  