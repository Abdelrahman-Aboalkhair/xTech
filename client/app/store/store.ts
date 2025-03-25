import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/AuthApi";
import authReducer from "./slices/AuthSlice";
import toastReducer from "./slices/ToastSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    toasts: toastReducer,

    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
