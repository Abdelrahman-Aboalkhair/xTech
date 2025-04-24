import { apiSlice } from "../slices/ApiSlice";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /chat/:id
    getChat: builder.query({
      query: (id: string) => `/chat/${id}`,
    }),

    // GET /chat/user/:userId
    getUserChats: builder.query({
      query: () => `/chat/user`,
    }),

    // GET /chat
    getAllChats: builder.query({
      query: () => "/chat",
    }),

    // POST /chat
    createChat: builder.mutation({
      query: () => ({
        url: "/chat",
        method: "POST",
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
  useGetUserChatsQuery,
  useGetAllChatsQuery,
  useCreateChatMutation,
  useSendMessageMutation,
  useUpdateChatStatusMutation,
} = chatApi;
