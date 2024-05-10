import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const userOvertimeApi = createApi({
  reducerPath: "userOvertimeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://talentsapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["UserOvertimes"],
  endpoints: (builder) => ({
    getUserOvertimes: builder.query({
      query: ({ searchString }) => ({
        url: `userOvertime?searchString=${searchString}`,
      }),
      providesTags: (result, error, { searchString }) => [
        {
          type: "UserOvertimes" as const,
          searchString,
        },
      ],
    }),
    getUserOvertimeById: builder.query({
      query: (id) => ({
        url: `userOvertime/${id}`,
      }),
      providesTags: ["UserOvertimes"],
    }),
    createUserOvertime: builder.mutation({
      query: (data) => ({
        url: "userOvertime",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserOvertimes"],
    }),
    updateUserOvertime: builder.mutation({
      query: ({ data, id }) => ({
        url: "userOvertime/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UserOvertimes"],
    }),
    deleteUserOvertime: builder.mutation({
      query: (id) => ({
        url: "userOvertime/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["UserOvertimes"],
    }),




  }),
});

  
  export const {
    useGetUserOvertimesQuery,
    useGetUserOvertimeByIdQuery,
    useCreateUserOvertimeMutation,
    useUpdateUserOvertimeMutation,
    useDeleteUserOvertimeMutation,
  
  } = userOvertimeApi;
  export default userOvertimeApi;
  