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

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
