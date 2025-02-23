import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  gender: string;
  birthDate: string;
  image: string;
  [key: string]: any;
}

interface UsersState {
  users: User[];
  total: number;
  limit: number;
  page: number;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  total: 0,
  limit: 5,
  page: 1,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({
    limit,
    page,
    filters = {},
  }: {
    limit: number;
    page: number;
    filters?: { [key: string]: string };
  }) => {
    const skip = (page - 1) * limit;

    try {
      if (
        Object.keys(filters).length > 0 &&
        filters[Object.keys(filters)[0]] !== ""
      ) {
        const filterKey = Object.keys(filters)[0];
        const filterValue = filters[Object.keys(filters)[0]];
        // console.log(filterKey, filterValue);
        let response;
        if (filterKey === "name") {
          const firstName = filterValue.split(" ")[0];
          response = await axios.get(
            `https://dummyjson.com/users/filter?key=firstName&value=${firstName}&limit=${limit}&skip=${skip}`
          );
        } else {
          response = await axios.get(
            `https://dummyjson.com/users/filter?key=${filterKey}&value=${filterValue}&limit=${limit}&skip=${skip}`
          );
        }

        return response.data;
      } else {
        const response = await axios.get(
          `https://dummyjson.com/users?limit=${limit}&skip=${skip}`
        );
        return response.data;
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new Error("Request canceled");
      }
      throw error;
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload.users;
      state.total = action.payload.total;
      state.limit = action.meta.arg.limit;
      state.page = action.meta.arg.page;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch users";
    });
  },
});

export default usersSlice.reducer;
