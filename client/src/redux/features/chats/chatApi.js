import { baseApi } from "../../api/baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // =========================
    // GET CONVERSATIONS
    // =========================
    getConversations: builder.query({
      query: ({ page = 1, limit = 50 } = {}) =>
        `/chat?page=${page}&limit=${limit}`,

      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((c) => ({
                type: "Conversation",
                id: c._id,
              })),
              { type: "Conversation", id: "LIST" },
            ]
          : [{ type: "Conversation", id: "LIST" }],
    }),

    // =========================
    // START CONVERSATION
    // =========================
    startConversation: builder.mutation({
      query: ({ carId }) => ({
        url: "/chat/start",
        method: "POST",
        body: { carId },
      }),

      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }),

    // =========================
    // GET MESSAGES
    // =========================
    getMessages: builder.query({
      query: ({ conversationId, page = 1, limit = 50 }) =>
        `/chat/${conversationId}/messages?page=${page}&limit=${limit}`,

      providesTags: (result, error, arg) =>
        result?.data
          ? [
              ...result.data.map((m) => ({
                type: "Message",
                id: m._id,
              })),
              { type: "Conversation", id: arg.conversationId },
            ]
          : [{ type: "Conversation", id: arg.conversationId }],
    }),

    // =========================
    // SEND MESSAGE
    // =========================
    sendMessage: builder.mutation({
      query: ({ conversationId, text }) => ({
        url: "/chat/message",
        method: "POST",
        body: { conversationId, text },
      }),

      async onQueryStarted(
        { conversationId, text },
        { dispatch, queryFulfilled }
      ) {
        // 🔥 optimistic update
        const patchResult = dispatch(
          chatApi.util.updateQueryData(
            "getMessages",
            { conversationId, page: 1, limit: 50 },
            (draft) => {
              if (!draft.data) draft.data = [];

              const tempId = `temp-${Date.now()}`;

              draft.data.push({
                _id: tempId,
                conversation: conversationId,
                sender: "me", // ⚠️ better replace with auth userId
                text,
                createdAt: new Date().toISOString(),
                read: false,
              });
            }
          )
        );

        try {
          const { data } = await queryFulfilled;

          // 🔁 replace temp message
          dispatch(
            chatApi.util.updateQueryData(
              "getMessages",
              { conversationId, page: 1, limit: 50 },
              (draft) => {
                const idx = draft.data.findIndex((m) =>
                  m._id.startsWith("temp-")
                );
                if (idx !== -1) draft.data[idx] = data.data || data;
              }
            )
          );

          // 🔄 update conversations list
          dispatch(
            chatApi.util.invalidateTags([
              { type: "Conversation", id: "LIST" },
            ])
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetConversationsQuery,
  useStartConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
} = chatApi;