import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const resgnationApi = createApi({
  reducerPath: "resgnationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://talentsapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["Resgnations"],
  endpoints: (builder) => ({
    getResgnations: builder.query({
      query: ({ searchString }) => ({
        url: `resgnation?searchString=${searchString}`,
      }),
      providesTags: (result, error, { searchString }) => [
        {
          type: "Resgnations" as const,
          searchString,
        },
      ],
    }),
    getResgnationById: builder.query({
      query: (id) => ({
        url: `resgnation/${id}`,
      }),
      providesTags: ["Resgnations"],
    }),
    createResgnation: builder.mutation({
      query: (data) => ({
        url: "resgnation",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Resgnations"],
    }),
    updateResgnation: builder.mutation({
      query: ({ data, id }) => ({
        url: "resgnation/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Resgnations"],
    }),
    deleteResgnation: builder.mutation({
      query: (id) => ({
        url: "resgnation/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Resgnations"],
    }),
  }),
});

  
  export const {
    useGetResgnationsQuery,
    useGetResgnationByIdQuery,
    useCreateResgnationMutation,
    useUpdateResgnationMutation,
    useDeleteResgnationMutation,
  } = resgnationApi;
  export default resgnationApi;
  