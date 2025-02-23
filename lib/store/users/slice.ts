import { UsersState } from "@/lib/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: UsersState = {
  users: [],
  total: 0,
  limit: 5,
  page: 1,
  loading: false,
  error: null,
  allUsers: [],
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

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async () => {
    const response = await axios.get("https://dummyjson.com/users?limit=100");
    return response.data.users;
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

    // fetchAllUsers
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.allUsers = action.payload;
    });
    builder.addCase(fetchAllUsers.rejected, (state, action) => {
      console.error("Failed to fetch all users:", action.error.message);
    });
  },
});

export default usersSlice.reducer;
