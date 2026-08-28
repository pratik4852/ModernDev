import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,

    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    addUser: builder.mutation({
      query: (body) => ({
        url: "/api/user/adduser",
        method: "POST",
        body,
      }),
    }),

    getUser: builder.query({
      query: ({ page = 1, limit = 10, gender = "" } = {}) => ({
        url: "/api/user/getuser",
        params: {
          page,
          limit,
          ...(gender ? { gender } : {}),
        },
      }),
    }),

    getGenderList: builder.query({
      query: () => "/api/user/gender-list",
    }),

    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/user/updateuser/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/user/deleteuser/${id}`,
        method: "DELETE",
      }),
    }),
    createNotifications: builder.mutation({
      query: (body) => ({
        url: "/api/notifications/notification",
        method: "POST",
        body,
      }),
    }),
    getNotifications: builder.query({
      query: () => "/api/notifications/notification",
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/api/notifications/notification/${id}`,
        method: "DELETE",
      }),
    }),
    createLms: builder.mutation({
      query: (body) => ({
        url: "/api/lms",
        method: "POST",
        body,
      }),
    }),
    getLms: builder.query({
      query: () => "/api/lms",
    }),
    updateLms: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/lms/${id}`,
        method: "PUT",
        body,
      }),
    }),
    deleteLms: builder.mutation({
      query: (id) => ({
        url: `/api/lms/${id}`,
        method: "DELETE",
      }),
    }),
    createHousehold: builder.mutation({
      query: (body) => ({
        url: "/api/households",
        method: "POST",
        body,
      }),
    }),
    getHousehold: builder.query({
      query: () => "/api/households",
    }),
    updateHousehold: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/households/${id}`,
        method: "PUT",
        body,
      }),
    }),
    deleteHousehold: builder.mutation({
      query: (id) => ({
        url: `/api/households/${id}`,
        method: "DELETE",
      }),
    }),
    createHouseholdMember: builder.mutation({
      query: (body) => ({
        url: "/api/members",
        method: "POST",
        body,
      }),
    }),

    getHouseholdMembers: builder.query({
      query: () => "/api/members",
    }),
    updateHouseholdMember: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/members/${id}`,
        method: "PUT",
        body,
      }),
    }),
    deleteHouseholdMember: builder.mutation({
      query: (id) => ({
        url: `/api/members/${id}`,
        method: "DELETE",
      }),
    }),

    createTicket: builder.mutation({
      query: (body) => ({
        url: "/api/tickets",
        method: "POST",
        body,
      }),
    }),
    getTickets: builder.query({
      query: () => "/api/tickets",
    }),
    updateTicket: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/tickets/${id}`,
        method: "PUT",
        body,
      }),
    }),
    deleteTicket: builder.mutation({
      query: (id) => ({
        url: `/api/tickets/${id}`,
        method: "DELETE",
      }),
    }),
    createSurveys: builder.mutation({
      query: (body) => ({
        url: "/api/surveys",
        method: "POST",
        body,
      }),
    }),
    // getSurveys: builder.query({
    //   query: () => "/api/surveys",
    // }),
    // updateSurveys: builder.mutation({
    //   query: ({ id, ...body }) => ({
    //     url: `/api/surveys/${id}`,
    //     method: "PUT",
    //     body,
    //   }),
    // }),
    // deleteSurveys: builder.mutation({
    //   query: (id) => ({
    //     url: `/api/surveys/${id}`,
    //     method: "DELETE",
    //   }),
    // }),

    getSurveys: builder.query({
      query: () => "/api/surveys",
    }),

    createSurveys: builder.query({
      query: (body) => ({
        url: "/api/surveys",
        method: "POST",
        body,
      }),
    }),

    updateSurveys: builder.query({
      query: ({ id, ...body }) => ({
        url: `/api/surveys/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deleteSurveys: builder.query({
      query: (id) => ({
        url: `/api/surveys/${id}`,
        method: "DELETE",
      }),
    }),
    addSurveyQuestion: builder.mutation({
      query: ({ surveyId, body }) => ({
        url: `/api/surveys/${surveyId}/questions`,
        method: "POST",
        body,
      }),
    }),

    getSurveyQuestions: builder.query({
      query: (surveyId) => `/api/surveys/${surveyId}/questions`,
    }),

    addSurveyResponse: builder.mutation({
      query: ({ surveyId, body }) => ({
        url: `/api/surveys/${surveyId}/responses`,
        method: "POST",
        body,
      }),
    }),

    getSurveyResponse: builder.query({
      query: (surveyId) => `/api/surveys/${surveyId}/responses`,
    }),



    addAudience: builder.mutation({
      query: (body) => ({
        url: "/api/audience",
        method: "POST",
        body,
      }),
    }),

    getAudience: builder.query({
      query: () => "/api/audience",
    }),

    updateAudience: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/audience/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deleteAudience: builder.mutation({
      query: (id) => ({
        url: `/api/audience/${id}`,
        method: "DELETE",
      }),
    }),

    addSettings: builder.mutation({
      query: (body) => ({
        url: "/api/settings",
        method: "POST",
        body,
      }),
    }),
    getSettings: builder.query({
      query: () => "/api/settings",
    }),
    updateSettings: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/settings/${id}`,
        method: "PUT",
        body,
      }),
    }),
    deleteSettings: builder.mutation({
      query: (id) => ({
        url: `/api/settings/${id}`,
        method: "DELETE",
      }),
    }),
    createFeedback: builder.mutation({
      query: (body) => ({
        url: "/api/feedback",
        method: "POST",
        body,
      }),
    }),
    getFeedback: builder.query({
      query: () => "/api/feedback",
    }),
    deleteFeedback: builder.mutation({
      query: (id) => ({
        url: `/api/feedback/${id}`,
        method: "DELETE",
      }),
    }),
    updateFeedback: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/feedback/${id}`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetGenderListQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useCreateNotificationsMutation,
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useCreateLmsMutation,
  useGetLmsQuery,
  useUpdateLmsMutation,
  useDeleteLmsMutation,
  useCreateHouseholdMutation,
  useGetHouseholdQuery,
  useUpdateHouseholdMutation,
  useDeleteHouseholdMutation,
  useCreateHouseholdMemberMutation,
  useGetHouseholdMembersQuery,
  useUpdateHouseholdMemberMutation,
  useDeleteHouseholdMemberMutation,
  useCreateTicketMutation,
  useGetTicketsQuery,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  // useCreateSurveysMutation,
  // useGetSurveysQuery,
  // useUpdateSurveysMutation,
  // useDeleteSurveysMutation,
  useGetSurveysQuery,
  useLazyCreateSurveysQuery,
  useLazyUpdateSurveysQuery,
  useLazyDeleteSurveysQuery,
  useAddSurveyQuestionMutation,
  useGetSurveyQuestionsQuery,
  useAddSurveyResponseMutation,
  useGetSurveyResponseQuery,
  useAddAudienceMutation,
  useGetAudienceQuery,
  useUpdateAudienceMutation,
  useDeleteAudienceMutation,
  useAddSettingsMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useDeleteSettingsMutation,
  useCreateFeedbackMutation,
  useGetFeedbackQuery,
  useDeleteFeedbackMutation,
  useUpdateFeedbackMutation,
} = baseApi;
