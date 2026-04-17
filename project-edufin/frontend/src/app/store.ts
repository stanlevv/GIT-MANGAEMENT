import { configureStore } from "@reduxjs/toolkit";
import { aiApi } from "./services/aiApi";

export const store = configureStore({
  reducer: {
    [aiApi.reducerPath]: aiApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(aiApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
