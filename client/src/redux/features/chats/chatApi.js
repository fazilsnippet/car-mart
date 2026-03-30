import { baseApi } from "../../api/baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => "/chat",
      providesTags: ["Conversation"]
    }),

    getMessages: builder.query({
      query: ({ conversationId, page = 1, limit = 20 }) =>
        `/chat/${conversationId}/messages?page=${page}&limit=${limit}`,
      providesTags: (result, error, arg) => [
        { type: "Message", id: arg.conversationId }
      ]
    }),

    startConversation: builder.mutation({
      query: (body) => ({
        url: "/chat/start",
        method: "POST",
        body
      }),
      invalidatesTags: ["Conversation"]
    }),

    sendMessage: builder.mutation({
      query: ({ conversationId, text }) => ({
        url: "/chat/message",
        method: "POST",
        body: { conversationId, text }
      }),
      invalidatesTags: (result, error, arg) => [
        "Conversation",
        { type: "Message", id: arg.conversationId }
      ]
    })
  }),
  overrideExisting: false,
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useStartConversationMutation,
  useSendMessageMutation
} = chatApi;