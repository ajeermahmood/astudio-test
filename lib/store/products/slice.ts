import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchProducts } from "@/lib/api/dummyjson";
import { Product } from "@/lib/types";

interface ProductsState {
  data: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    currentPage: number;
    totalItems: number;
    pageSize: number;
  };
}

const initialState: ProductsState = {
  data: [],
  status: "idle",
  error: null,
  pagination: {
    currentPage: 1,
    totalItems: 0,
    pageSize: 5,
  },
};

export const fetchAllProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({
    page = 1,
    limit = 5,
    category,
  }: {
    page?: number;
    limit?: number;
    category?: string;
  }) => {
    const response = await fetchProducts({ page, limit, category });
    return response.data;
  }
);

const productsSlice = createSlice({
  name: "products",
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
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.products;
        state.pagination.totalItems = action.payload.total;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export const { setPageSize, setCurrentPage } = productsSlice.actions;
export default productsSlice.reducer;
