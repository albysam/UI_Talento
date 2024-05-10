import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const attendenceApi = createApi({
  reducerPath: "attendenceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://talentsapi.azurewebsites.net/api/",
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["Attendences"],
  endpoints: (builder) => ({
    getAttendences: builder.query({
      query: ({ searchString }) => ({
        url: `attendence?searchString=${searchString}`,
      }),
      providesTags: (result, error, { searchString }) => [
        {
          type: "Attendences" as const,
          searchString,
        },
      ],
    }),
    getAttendenceById: builder.query({
      query: (id) => ({
        url: `attendence/${id}`,
      }),
      providesTags: ["Attendences"],
    }),
    createAttendence: builder.mutation({
      query: (data) => ({
        url: "attendence",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Attendences"],
    }),
    updateAttendence: builder.mutation({
      query: ({ data, id }) => ({
        url: "attendence/" + id,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Attendences"],
    }),
    deleteAttendence: builder.mutation({
      query: (id) => ({
        url: "attendence/" + id,
        method: "DELETE",
      }),
      invalidatesTags: ["Attendences"],
    }),
   
  }),
});

  
  export const {
    useGetAttendencesQuery,
    useGetAttendenceByIdQuery,
    useCreateAttendenceMutation,
    useUpdateAttendenceMutation,
    useDeleteAttendenceMutation,
  } = attendenceApi;
  export default attendenceApi;
  