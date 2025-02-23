import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  // User filters
  searchQuery: string;
  gender: string;
  ageGroup: string;
  pageSize: number;

  // Product filters
  productSearchQuery: string;
  productCategory: string;
  productBrand: string;
}

const initialState: FiltersState = {
  // User filters
  searchQuery: '',
  gender: 'all',
  ageGroup: 'all',
  pageSize: 5,

  // Product filters
  productSearchQuery: '',
  productCategory: 'all',
  productBrand: 'all',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // User filter actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setGenderFilter: (state, action: PayloadAction<string>) => {
      state.gender = action.payload;
    },
    setAgeGroupFilter: (state, action: PayloadAction<string>) => {
      state.ageGroup = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },

    // Product filter actions
    setProductSearchQuery: (state, action: PayloadAction<string>) => {
      state.productSearchQuery = action.payload;
    },
    setProductCategoryFilter: (state, action: PayloadAction<string>) => {
      state.productCategory = action.payload;
    },
    setProductBrandFilter: (state, action: PayloadAction<string>) => {
      state.productBrand = action.payload;
    },

    // Reset actions
    resetUserFilters: (state) => {
      state.searchQuery = '';
      state.gender = 'all';
      state.ageGroup = 'all';
    },
    resetProductFilters: (state) => {
      state.productSearchQuery = '';
      state.productCategory = 'all';
      state.productBrand = 'all';
    },
    resetAllFilters: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  // User filter actions
  setSearchQuery,
  setGenderFilter,
  setAgeGroupFilter,
  setPageSize,

  // Product filter actions
  setProductSearchQuery,
  setProductCategoryFilter,
  setProductBrandFilter,

  // Reset actions
  resetUserFilters,
  resetProductFilters,
  resetAllFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;