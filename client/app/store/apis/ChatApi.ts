import { apiSlice } from "../slices/ApiSlice";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /chat/:id
    getChat: builder.query({
      query: (id: string) => `/chat/${id}`,
    }),

    // GET /chat/user/:userId
    getChatsByUser: builder.query({
      query: (userId: string) => `/chat/user/${userId}`,
    }),

    // GET /chat
    getAllChats: builder.query({
      query: () => "/chat",
    }),

    // POST /chat
    createChat: builder.mutation({
      query: (userId: string) => ({
        url: "/chat",
        method: "POST",
        body: { userId },
      }),
    }),

    // POST /chat/:chatId/message
    sendMessage: builder.mutation({
      query: ({ chatId, content }: { chatId: string; content: string }) => ({
        url: `/chat/${chatId}/message`,
        method: "POST",
        body: { chatId, content },
      }),
    }),

    // PATCH /chat/:chatId/status
    updateChatStatus: builder.mutation({
      query: ({
        chatId,
        status,
      }: {
        chatId: string;
        status: "OPEN" | "RESOLVED";
      }) => ({
        url: `/chat/${chatId}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),
  }),
});

export const {
  useGetChatQuery,
  useGetChatsByUserQuery,
  useGetAllChatsQuery,
  useCreateChatMutation,
  useSendMessageMutation,
  useUpdateChatStatusMutation,
} = chatApi;
