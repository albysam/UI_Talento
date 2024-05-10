import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const departmentApi = createApi({
  reducerPath: "departmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://talentsapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["Departments"],
  endpoints: (builder) => ({
    getDepartments: builder.query({
      query: ({ searchString }) => ({
        url: `department?searchString=${searchString}`,
      }),
      providesTags: (result, error, { searchString }) => [
        {
          type: "Departments" as const,
          searchString,
        },
      ],
    }),
    getDepartmentById: builder.query({
      query: (id) => ({
        url: `department/${id}`,
      }),
      providesTags: ["Departments"],
    }),
    createDepartment: builder.mutation({
      query: (data) => ({
        url: "department",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Departments"],
    }),
    updateDepartment: builder.mutation({
      query: ({ data, id }) => ({
        url: "department/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Departments"],
    }),
    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: "department/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Departments"],
    }),
  }),
});

  
  export const {
    useGetDepartmentsQuery,
    useGetDepartmentByIdQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
    useDeleteDepartmentMutation,
  } = departmentApi;
  export default departmentApi;
  