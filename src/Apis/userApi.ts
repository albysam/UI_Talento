import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://talentsapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (userDetails) => ({
        url: "user",
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: userDetails,
      }),
      invalidatesTags: ["Users"],
    }),
    getAllUsers: builder.query({
      query: ({ userId, searchString, status, pageNumber, pageSize }) => ({
        url: "user",
        params: {
          ...(userId && { userId }),
          ...(searchString && { searchString }),
          ...(status && { status }),
          ...(pageSize && { pageSize }),
          ...(pageNumber && { pageNumber }),
        },
      }),
      transformResponse(apiResponse: { result: any }, meta: any) {
        return {
          apiResponse,
          totalRecords: meta.response.headers.get("X-Pagination"),
        };
      },
      providesTags: ["Users"],
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `user/${id}`,
      }),
      providesTags: ["Users"],
    }),
    updateUserHeader: builder.mutation({
      query: (userDetails) => ({
        url: "user/" + userDetails.userHeaderId,
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: userDetails,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetAllUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserHeaderMutation,
} = userApi;
export default userApi;
