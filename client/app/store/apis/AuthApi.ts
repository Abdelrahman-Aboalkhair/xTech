import { User } from "@/app/types/authTypes";
import { apiSlice } from "../slices/ApiSlice";
import { clearAuthState, setCredentials } from "../slices/AuthSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<
      { user: User; accessToken: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/sign-in",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        console.log("data ");
        dispatch(setCredentials({ accessToken: data.accessToken }));
      },
    }),
    signup: builder.mutation<{ user: User; accessToken: string }, FormData>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        console.log("data ");
        dispatch(setCredentials({ accessToken: data.accessToken }));
      },
    }),
    signOut: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/sign-out",
        method: "GET",
      }),
    }),

    verifyEmail: builder.mutation<void, { emailVerificationCode: string }>({
      query: ({ emailVerificationCode }) => {
        return {
          url: "/auth/verify-email",
          method: "POST",
          body: { emailVerificationCode },
        };
      },
    }),

    forgotPassword: builder.mutation<void, { email: string }>({
      query: ({ email }) => {
        return {
          url: "/auth/forgot-password",
          method: "POST",
          body: { email },
        };
      },
    }),

    resetPassword: builder.mutation<
      void,
      { token: string; newPassword: string }
    >({
      query: ({ token, newPassword }) => {
        return {
          url: "/auth/reset-password",
          method: "POST",
          body: { newPassword, token },
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    restoreSession: builder.query<{ accessToken: string; user: User }, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("restored data: ", data);
          dispatch(
            setCredentials({ accessToken: data.accessToken, user: data.user })
          );
        } catch (error) {
          console.log("Session restoration failed:", error);
          dispatch(clearAuthState());
        }
      },
    }),
  }),
});

export const {
  useSignInMutation,
  useSignupMutation,
  useSignOutMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRestoreSessionQuery,
} = authApi;
