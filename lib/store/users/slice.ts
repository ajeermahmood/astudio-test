import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUsers } from "@/lib/api/dummyjson";
import { User } from "@/lib/types";

interface UsersState {
  data: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    currentPage: number;
    totalItems: number;
    pageSize: number;
  };
}

const initialState: UsersState = {
  data: [],
  status: "idle",
  error: null,
  pagination: {
    currentPage: 1,
    totalItems: 0,
    pageSize: 5,
  },
};

export const fetchAllUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({
    page = 1,
    limit = 5,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await fetchUsers({ page, limit, search });
    console.log(response);
    return response;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when changing page size
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.users;
        state.pagination.totalItems = action.payload.total;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});

export const { setPageSize, setCurrentPage } = usersSlice.actions;
export default usersSlice.reducer;
