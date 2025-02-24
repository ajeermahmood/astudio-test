import { ProductsState } from "@/lib/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState: ProductsState = {
  products: [],
  total: 0,
  limit: 5,
  page: 1,
  loading: true,
  error: null,
  allProducts: [],
  allCategories: [],
};

interface FetchProductsParams {
  limit: number;
  page: number;
  filters?: any;
  signal?: AbortSignal;
}

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ limit, page, filters = {}, signal }: FetchProductsParams) => {
    const skip = (page - 1) * limit;
    const config = signal ? { signal } : {};

    try {
      if (
        Object.keys(filters).length > 0 &&
        filters[Object.keys(filters)[0]] !== ""
      ) {
        const filterKey = Object.keys(filters)[0];
        const filterValue = filters[filterKey];
        // console.log(filterKey, filterValue);

        let response;
        if (filterKey === "category") {
          response = await axios.get(
            `https://dummyjson.com/products/category/${filterValue}?limit=${limit}&skip=${skip}`
          );
        } else {
          const queryValue = encodeURIComponent(filterValue);
          response = await axios.get(
            `https://dummyjson.com/products/search?q=${queryValue}&limit=${limit}&skip=${skip}`
          );
        }

        return response.data;
      } else {
        const response = await axios.get(
          `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
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

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async () => {
    const response = await axios.get(
      "https://dummyjson.com/products?limit=100"
    );
    return response.data.products;
  }
);

export const fetchAllCategories = createAsyncThunk(
  "products/fetchAllCategories",
  async () => {
    const response = await axios.get(
      "https://dummyjson.com/products/category-list"
    );
    return response.data;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state, action) => {
      state.loading = true;
      state.error = null;
      if (action.meta.arg.page === 1) {
        state.products = [];
      }
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
      state.total = action.payload.total;
      state.limit = action.meta.arg.limit;
      state.page = action.meta.arg.page;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch products";
    });

    // fetchAllProducts
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.allProducts = action.payload;
    });
    builder.addCase(fetchAllProducts.rejected, (state, action) => {
      console.error("Failed to fetch all users:", action.error.message);
    });

    // fetchAllCategories
    builder.addCase(fetchAllCategories.fulfilled, (state, action) => {
      state.allCategories = action.payload;
    });
    builder.addCase(fetchAllCategories.rejected, (state, action) => {
      console.error("Failed to fetch all users:", action.error.message);
    });
  },
});

export default productsSlice.reducer;
