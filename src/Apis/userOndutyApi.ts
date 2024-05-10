import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const userOndutyApi = createApi({
  reducerPath: "userOndutyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://talentsapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["UserOndutys"],
  endpoints: (builder) => ({
    getUserOndutys: builder.query({
      query: ({ searchString }) => ({
        url: `userOnduty?searchString=${searchString}`,
      }),
      providesTags: (result, error, { searchString }) => [
        {
          type: "UserOndutys" as const,
          searchString,
        },
      ],
    }),
    getUserOndutyById: builder.query({
      query: (id) => ({
        url: `userOnduty/${id}`,
      }),
      providesTags: ["UserOndutys"],
    }),
    createUserOnduty: builder.mutation({
      query: (data) => ({
        url: "userOnduty",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserOndutys"],
    }),
    updateUserOnduty: builder.mutation({
      query: ({ data, id }) => ({
        url: "userOnduty/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UserOndutys"],
    }),
    deleteUserOnduty: builder.mutation({
      query: (id) => ({
        url: "userOnduty/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["UserOndutys"],
    }),




  }),
});

  
  export const {
    useGetUserOndutysQuery,
    useGetUserOndutyByIdQuery,
    useCreateUserOndutyMutation,
    useUpdateUserOndutyMutation,
    useDeleteUserOndutyMutation,
  
  } = userOndutyApi;
  export default userOndutyApi;
  