import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const applicationUserApi = createApi({
  reducerPath: "applicationUserApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://talentsapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["ApplicationUsers"],
  endpoints: (builder) => ({

    getApplicationUsers: builder.query({
      query: ({ searchString, department, status, pageNumber, pageSize }) => ({
        url: `applicationuser?searchString=${searchString}&department=${department}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
      }),
      providesTags: (result, error, { searchString }) => [
        {
          type: "ApplicationUsers",
          searchString,
        },
      ],
    }),
    
    
      getUsersChat: builder.query({
        query: () => ({
          url: `Userschat`,
        }),
        providesTags: ["ApplicationUsers"],
      }),
   
    
    getApplicationUserById: builder.query({
      query: (id) => ({
        url: `applicationuser/${id}`,
      }),
      providesTags: ["ApplicationUsers"],
    }),
    createApplicationUser: builder.mutation({
      query: (data) => ({
        url: "applicationuser",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ApplicationUsers"],
    }),
    updateApplicationUser: builder.mutation({
      query: ({ data, id }) => ({
        url: "applicationuser/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ApplicationUsers"],
    }),
    deleteApplicationUser: builder.mutation({
      query: (id) => ({
        url: "applicationuser/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["ApplicationUsers"],
    }),


    getDesgnationsList: builder.query({
      query: (departmentId) => ({
        url: `ApplicationUser/Desgnations?departmentId=${departmentId}`,
      }),
      providesTags: (result, error, departmentId) => [{ type: 'ApplicationUsers', id: departmentId }],
    }),

    updateApplicationUserPassword: builder.mutation({
      query: ({ data, id }) => ({
        url: `applicationuser/${id}/Password`, 
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ApplicationUsers"],
    }),

    blockApplicationUser: builder.mutation({
      query: (id) => ({
        url: `applicationuser/${id}/block`,
        method: "PUT",
      }),
      invalidatesTags: ["ApplicationUsers"],
    }),

    unblockApplicationUser: builder.mutation({
      query: (id) => ({
        url: `applicationuser/${id}/unblock`,
        method: "PUT",
      }),
      invalidatesTags: ["ApplicationUsers"],
    }),
    getSalaryDetails: builder.query({
      query: ({ search, year, month }) => ({
        url: `applicationuser/SalaryDetails`,
        params: { search, year, month },
      }),
      providesTags: ["ApplicationUsers"],
    }),
    

  }),
});

export const {
  useGetApplicationUsersQuery,
 useGetUsersChatQuery,
  useGetApplicationUserByIdQuery,
  useCreateApplicationUserMutation,
  useUpdateApplicationUserMutation,
  useDeleteApplicationUserMutation,
  useGetDesgnationsListQuery,
  useUpdateApplicationUserPasswordMutation,
  useBlockApplicationUserMutation,
  useUnblockApplicationUserMutation,
  useGetSalaryDetailsQuery,
} = applicationUserApi;
export default applicationUserApi;
