import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice.js";
import cartReducer from "../cart/cartSlice.js";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  },
});
