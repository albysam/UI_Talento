import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const desgnationApi = createApi({
  reducerPath: "desgnationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://talentsapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["Desgnations"],
  endpoints: (builder) => ({



    getDesgnations: builder.query({
      query: ({ searchString }) => ({
        url: `desgnation?searchString=${searchString}`,
      }),
      providesTags: (result, error, { searchString }) => [
        {
          type: "Desgnations" as const,
          searchString,
        },
      ],
    }),



    getDesgnationById: builder.query({
      query: (id) => ({
        url: `desgnation/${id}`,
      }),
      providesTags: ["Desgnations"],
    }),


    createDesgnation: builder.mutation({
      query: (data) => ({
        url: "desgnation",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Desgnations"],
    }),


    updateDesgnation: builder.mutation({
      query: ({ data, id }) => ({
        url: "desgnation/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Desgnations"],
    }),


    
    deleteDesgnation: builder.mutation({
      query: (id) => ({
        url: "desgnation/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Desgnations"],
    }),


getDepartmentsList: builder.query({
  query: () => ({
    url: "desgnation/Departments",
  }),
  providesTags: ["Desgnations"],
}),
getShiftsList: builder.query({
  query: () => ({
    url: "desgnation/Shifts",
  }),
  providesTags: ["Desgnations"],
}),

getDesgnationstypeList: builder.query({
  query: (departmentId) => ({
    url: `desgnation/Desgnations?departmentId=${departmentId}`,
  }),
  providesTags: ["Desgnations"],
}),


  }),
});

  
  export const {
    useGetDesgnationsQuery,
    useGetDesgnationByIdQuery,
    useCreateDesgnationMutation,
    useUpdateDesgnationMutation,
    useDeleteDesgnationMutation,
    useGetDepartmentsListQuery, 
    useGetDesgnationstypeListQuery,
    useGetShiftsListQuery, 
  } = desgnationApi;
  export default desgnationApi;
  