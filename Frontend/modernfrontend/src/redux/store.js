import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AllSlices";
import { baseApi } from "./baseapi";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});