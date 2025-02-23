import { configureStore } from "@reduxjs/toolkit";
import usersSlice from "./users/slice";
import productsSlice from "./products/slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      users: usersSlice,
      products: productsSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
