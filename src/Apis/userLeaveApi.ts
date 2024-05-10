import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const userLeaveApi = createApi({
  reducerPath: "userLeaveApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://talentsapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["UserLeaves"],
  endpoints: (builder) => ({
    getUserLeaves: builder.query({
      query: ({ searchString }) => ({
        url: `userLeave?searchString=${searchString}`,
      }),
      providesTags: (result, error, { searchString }) => [
        {
          type: "UserLeaves" as const,
          searchString,
        },
      ],
    }),
    getUserLeaveById: builder.query({
      query: (id) => ({
        url: `userLeave/${id}`,
      }),
      providesTags: ["UserLeaves"],
    }),
    createUserLeave: builder.mutation({
      query: (data) => ({
        url: "userLeave",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserLeaves"],
    }),
    updateUserLeave: builder.mutation({
      query: ({ data, id }) => ({
        url: "userLeave/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UserLeaves"],
    }),
    deleteUserLeave: builder.mutation({
      query: (id) => ({
        url: "userLeave/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["UserLeaves"],
    }),


getLeavesList: builder.query({
  query: () => ({
    url: "UserLeave/Leaves",
  }),
  providesTags: ["UserLeaves"],
}),


  }),
});

  
  export const {
    useGetUserLeavesQuery,
    useGetUserLeaveByIdQuery,
    useCreateUserLeaveMutation,
    useUpdateUserLeaveMutation,
    useDeleteUserLeaveMutation,
    useGetLeavesListQuery,
  } = userLeaveApi;
  export default userLeaveApi;
  