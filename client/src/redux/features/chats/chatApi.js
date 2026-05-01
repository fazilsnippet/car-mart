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

//       // ✅ CRITICAL FIX: avoid cache mismatch
//       serializeQueryArgs: ({ queryArgs }) => ({
//         conversationId: queryArgs.conversationId,
//       }),

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
//     sendMessage: builder.mutation({
//   query: ({ text, conversationId, receiverId, carId }) => ({
//     url: "/chat/messages/new",
//     method: "POST",
//     body: {
//       text,
//       ...(conversationId
//         ? { conversationId }
//         : { receiverId, carId }),
//     },
//   }),

//   async onQueryStarted(
//     args,
//     { dispatch, queryFulfilled, getState }
//   ) {
//     const { text, conversationId, receiverId, carId, userId } = args;
//     const tempId = `temp-${Date.now()}`;

//     // =========================
//     // 🔀 CASE 1: EXISTING CHAT
//     // =========================
//     if (conversationId) {
//       const patchResult = dispatch(
//         chatApi.util.updateQueryData(
//           "getMessages",
//           { conversationId },
//           (draft) => {
//             if (!draft.data) draft.data = [];

//             draft.data.push({
//               _id: tempId,
//               conversation: conversationId,
//               sender: { _id: userId },
//               text,
//               createdAt: new Date().toISOString(),
//             });
//           }
//         )
//       );

//       try {
//         const { data } = await queryFulfilled;
//         const newMessage = data.data.message;

//         dispatch(
//           chatApi.util.updateQueryData(
//             "getMessages",
//             { conversationId },
//             (draft) => {
//               const idx = draft.data.findIndex(
//                 (m) => m._id === tempId
//               );

//               if (idx !== -1) {
//                 draft.data[idx] = newMessage;
//               }
//             }
//           )
//         );
//       } catch {
//         patchResult.undo();
//       }

//       return;
//     }

//     // =========================
//     // 🆕 CASE 2: FIRST MESSAGE
//     // =========================
//     // 👉 NO optimistic update in RTK cache
//     // 👉 handled in component local state

//     try {
//       const { data } = await queryFulfilled;

//       const newMessage = data.data.message;
//       const newConversationId = data.data.conversationId;

//       // 🔥 IMPORTANT: seed cache for new conversation
//       dispatch(
//         chatApi.util.upsertQueryData(
//           "getMessages",
//           { conversationId: newConversationId },
//           {
//             data: [newMessage],
//           }
//         )
//       );

//       // 👉 You must update UI state outside (component)
//       // because RTK cannot switch your screen mode
//     } catch (err) {
//       // handle error in UI
//     }
//   },

//   invalidatesTags: [{ type: "Conversation", id: "LIST" }],
// }),
//     }),
//   }),


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
        `/chat/conversations?page=${page}&limit=${limit}`,
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
    // GET MESSAGES
    // =========================
    getMessages: builder.query({
      query: ({ conversationId, page = 1, limit = 50 }) =>
        `/chat/messages/${conversationId}?page=${page}&limit=${limit}`,

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
    // SEND MESSAGE (FINAL)
    // =========================
//  sendMessage: builder.mutation({
//   query: ({ text, conversationId, carId }) => ({
//     url: "/chat/message",
//     method: "POST",
//     body: {
//       text,
//       ...(conversationId ? { conversationId } : { carId }),
//     },
//   }),

//   async onQueryStarted(args, { dispatch, queryFulfilled }) {
//     const { text, conversationId, userId } = args;
//     const tempId = `temp-${Date.now()}`;

//     // =========================
//     // 🟢 EXISTING CONVERSATION
//     // =========================
//     if (conversationId) {
//       const patch = dispatch(
//         chatApi.util.updateQueryData(
//           "getMessages",
//           { conversationId },
//           (draft) => {
//             if (!draft.data) draft.data = [];

//             draft.data.push({
//               _id: tempId,
//               conversation: conversationId,
//               sender: { _id: userId },
//               text,
//               createdAt: new Date().toISOString(),
//             });
//           }
//         )
//       );

//       try {
//         const { data } = await queryFulfilled;
//         const newMessage = data.data.message;

//         dispatch(
//           chatApi.util.updateQueryData(
//             "getMessages",
//             { conversationId },
//             (draft) => {
//               const idx = draft.data.findIndex(
//                 (m) => m._id === tempId
//               );

//               if (idx !== -1) {
//                 draft.data[idx] = newMessage;
//               }
//             }
//           )
//         );
//       } catch {
//         patch.undo();
//       }

//       return;
//     }

//     // =========================
//     // 🆕 FIRST MESSAGE FLOW
//     // =========================
//     try {
//       const { data } = await queryFulfilled;

//       const newMessage = data.data.message;
//       const newConversationId = data.data.conversationId;

//       // ✅ 1. Prime cache safely (NOT upsert)
//       dispatch(
//         chatApi.util.updateQueryData(
//           "getMessages",
//           { conversationId: newConversationId },
//           (draft) => {
//             if (!draft.data) draft.data = [];
//             draft.data.push(newMessage);
//           }
//         )
//       );

//       // ❗ 2. Force refresh conversation list
//       dispatch(
//         chatApi.util.invalidateTags([
//           { type: "Conversation", id: "LIST" },
//         ])
//       );

//     } catch (err) {
//       // handled in UI
//     }
//   },

//   invalidatesTags: [{ type: "Conversation", id: "LIST" }],
// }),

sendMessage: builder.mutation({
  query: ({ text, conversationId, carId }) => ({
    url: "/chat/message",
    method: "POST",
    body: {
      text,
      ...(conversationId ? { conversationId } : { carId }),
    },
  }),

  async onQueryStarted(args, { dispatch, queryFulfilled }) {
    const { text, conversationId, userId } = args;
    const tempId = `temp-${Date.now()}`;

    // =========================
    // 🟢 EXISTING CONVERSATION (OPTIMISTIC)
    // =========================
    let patch;

    if (conversationId) {
      patch = dispatch(
        chatApi.util.updateQueryData(
          "getMessages",
          { conversationId },
          (draft) => {
            if (!draft.data) draft.data = [];

            draft.data.push({
              _id: tempId,
              conversation: conversationId,
              sender: { _id: userId },
              text,
              createdAt: new Date().toISOString(),
              isTemp: true,
            });
          }
        )
      );
    }

    try {
      const { data } = await queryFulfilled;

      const newMessage = data.message;
      const newConversation = data.conversation;

      // =========================
      // 🟢 EXISTING CONVO → replace temp
      // =========================
      if (conversationId) {
        dispatch(
          chatApi.util.updateQueryData(
            "getMessages",
            { conversationId },
            (draft) => {
              const idx = draft.data.findIndex(
                (m) => m._id === tempId
              );

              if (idx !== -1) {
                draft.data[idx] = newMessage;
              }
            }
          )
        );

        return;
      }

      // =========================
      // 🆕 FIRST MESSAGE FLOW
      // =========================
      if (newConversation) {
        const newConversationId = newConversation._id;

        // ✅ 1. seed messages cache
        dispatch(
          chatApi.util.updateQueryData(
            "getMessages",
            { conversationId: newConversationId },
            (draft) => {
              if (!draft.data) draft.data = [];
              draft.data.push(newMessage);
            }
          )
        );

        // ✅ 2. insert into conversation list (no refetch flicker)
        dispatch(
          chatApi.util.updateQueryData(
            "getConversations",
            { page: 1, limit: 50 },
            (draft) => {
              if (!draft.data) draft.data = [];

              const exists = draft.data.find(
                (c) => c._id === newConversation._id
              );

              if (!exists) {
                draft.data.unshift(newConversation);
              }
            }
          )
        );
      }

      // ✅ 3. safe fallback refetch (optional but good)
      dispatch(
        chatApi.util.invalidateTags([
          { type: "Conversation", id: "LIST" },
        ])
      );

    } catch (err) {
      // rollback optimistic update
      if (patch) patch.undo();
    }
  },

  invalidatesTags: [], // ❗ handled manually above
}),
  }),
});

export const {
  
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} = chatApi;