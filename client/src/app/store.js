import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../redux/api/baseApi";
import authReducer from "../redux/features/auth/authSlice";
import uiReducer from "../redux/features/ui/theme";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
     ui: uiReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

