import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const userShiftApi = createApi({
  reducerPath: "userShiftApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://talentsapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["UserShifts"],
  endpoints: (builder) => ({
    getUserShifts: builder.query({
      query: ({ searchString }) => ({
        url: `userShift?searchString=${searchString}`,
      }),
      providesTags: (result, error, { searchString }) => [
        {
          type: "UserShifts" as const,
          searchString,
        },
      ],
    }),
    getUserShiftById: builder.query({
      query: (id) => ({
        url: `userShift/${id}`,
      }),
      providesTags: ["UserShifts"],
    }),
    createUserShift: builder.mutation({
      query: (data) => ({
        url: "userShift",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserShifts"],
    }),
    updateUserShift: builder.mutation({
      query: ({ data, id }) => ({
        url: "userShift/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UserShifts"],
    }),
    deleteUserShift: builder.mutation({
      query: (id) => ({
        url: "userShift/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["UserShifts"],
    }),


getShiftsList: builder.query({
  query: () => ({
    url: "UserShift/Shift",
  }),
  providesTags: ["UserShifts"],
}),

getUserShiftsByUserId: builder.query({
  query: (userId) => ({
    url: `UserShift/ByUserId/${userId}`,
  }),
  providesTags: (result, error, userId) => [
    {
      type: "UserShifts" as const,
      userId,
    },
  ],
}),
  }),
});

  
  export const {
    useGetUserShiftsQuery,
    useGetUserShiftByIdQuery,
    useCreateUserShiftMutation,
    useUpdateUserShiftMutation,
    useDeleteUserShiftMutation,
    useGetShiftsListQuery,
    useGetUserShiftsByUserIdQuery,
  } = userShiftApi;
  export default userShiftApi;
  