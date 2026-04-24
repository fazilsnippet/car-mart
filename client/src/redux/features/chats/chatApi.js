// import { baseApi } from "../../api/baseApi";

// export const chatApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({

//     // =========================
//     // GET CONVERSATIONS
//     // =========================
//     getConversations: builder.query({
//       query: ({ page = 1, limit = 50 } = {}) =>
//         `/chat?page=${page}&limit=${limit}`,

//       providesTags: (result) =>
//         result?.data
//           ? [
//               ...result.data.map((c) => ({
//                 type: "Conversation",
//                 id: c._id,
//               })),
//               { type: "Conversation", id: "LIST" },
//             ]
//           : [{ type: "Conversation", id: "LIST" }],
//     }),

//     // =========================
//     // START CONVERSATION
//     // =========================
//     startConversation: builder.mutation({
//       query: ({ carId }) => ({
//         url: "/chat/start",
//         method: "POST",
//         body: { carId },
//       }),

//       invalidatesTags: [{ type: "Conversation", id: "LIST" }],
//     }),

//     // =========================
//     // GET MESSAGES
//     // =========================
//     getMessages: builder.query({
//       query: ({ conversationId, page = 1, limit = 50 }) =>
//         `/chat/${conversationId}/messages?page=${page}&limit=${limit}`,

//       providesTags: (result, error, arg) =>
//         result?.data
//           ? [
//               ...result.data.map((m) => ({
//                 type: "Message",
//                 id: m._id,
//               })),
//               { type: "Conversation", id: arg.conversationId },
//             ]
//           : [{ type: "Conversation", id: arg.conversationId }],
//     }),

//     // =========================
//     // SEND MESSAGE
//     // =========================
//   sendMessage: builder.mutation({
//   query: ({ conversationId, text }) => ({
//     url: "/chat/message",
//     method: "POST",
//     body: { conversationId, text },
//   }),

//   invalidatesTags: (result, error, { conversationId }) => [
//     { type: "Conversation", id: conversationId },
//     { type: "Conversation", id: "LIST" },
//   ],

//   async onQueryStarted(
//     { conversationId, text, userId },
//     { dispatch, queryFulfilled }
//   ) {
//     const tempId = `temp-${Date.now()}`;

//     const patchResult = dispatch(
//       chatApi.util.updateQueryData(
//         "getMessages",
//         { conversationId, page: 1, limit: 50 },
//         (draft) => {
//           if (!draft.data) draft.data = [];

//           draft.data.push({
//             _id: tempId,
//             conversation: conversationId,
//             sender: userId,
//             text,
//             createdAt: new Date().toISOString(),
//             read: false,
//           });
//         }
//       )
//     );

//     try {
//       const { data } = await queryFulfilled;
//       const newMessage = data.data;

//       dispatch(
//         chatApi.util.updateQueryData(
//           "getMessages",
//           { conversationId, page: 1, limit: 50 },
//           (draft) => {
//             if (!draft.data) return;

//             const exists = draft.data.some(
//               (m) => m._id === newMessage._id
//             );

//             if (exists) {
//               draft.data = draft.data.filter(
//                 (m) => m._id !== tempId
//               );
//               return;
//             }

//             const idx = draft.data.findIndex(
//               (m) => m._id === tempId
//             );

//             if (idx !== -1) {
//               draft.data[idx] = newMessage;
//             } else {
//               draft.data.push(newMessage);
//             }
//           }
//         )
//       );
//     } catch {
//       patchResult.undo();
//     }
//   },
// })
//   })})

// export const {
//   useGetConversationsQuery,
//   useStartConversationMutation,
//   useGetMessagesQuery,
//   useSendMessageMutation,
// } = chatApi;

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

      // ✅ CRITICAL FIX: avoid cache mismatch
      serializeQueryArgs: ({ queryArgs }) => ({
        conversationId: queryArgs.conversationId,
      }),

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

      // ✅ only update conversation list
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],

      async onQueryStarted(
        { conversationId, text, userId },
        { dispatch, queryFulfilled }
      ) {
        const tempId = `temp-${Date.now()}`;

        // =========================
        // ✅ OPTIMISTIC UPDATE
        // =========================
        const patchResult = dispatch(
          chatApi.util.updateQueryData(
            "getMessages",
            { conversationId },
            (draft) => {
              if (!draft.data) draft.data = [];

              draft.data.push({
                _id: tempId,
                conversation: conversationId,
                sender: { _id: userId }, // ✅ consistent shape
                text,
                createdAt: new Date().toISOString(),
                read: false,
              });
            }
          )
        );

        try {
          const { data } = await queryFulfilled;
          const newMessage = data.data;

          // =========================
          // ✅ REPLACE TEMP / DEDUPE
          // =========================
          dispatch(
            chatApi.util.updateQueryData(
              "getMessages",
              { conversationId },
              (draft) => {
                if (!draft.data) return;

                const exists = draft.data.some(
                  (m) => m._id === newMessage._id
                );

                if (exists) {
                  // remove temp
                  draft.data = draft.data.filter(
                    (m) => m._id !== tempId
                  );
                  return;
                }

                const idx = draft.data.findIndex(
                  (m) => m._id === tempId
                );

                if (idx !== -1) {
                  draft.data[idx] = newMessage;
                } else {
                  draft.data.push(newMessage);
                }
              }
            )
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useStartConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
} = chatApi;