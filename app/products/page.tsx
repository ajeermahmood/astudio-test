'use client';
import DataTable from "@/components/common/DataTable";
import ProductFilters from "@/components/products/ProductFilters";
import { Product } from "@/lib/types";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  fetchAllProducts,
  setCurrentPage,
  setPageSize,
} from "@/lib/store/products/slice";
import { useEffect } from "react";
import CategoryTabs from "@/components/products/CategoryTabs";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { data, status, pagination, error } = useAppSelector(
    (state) => state.products
  );
  const { searchQuery, productCategory } = useAppSelector(
    (state) => state.filters
  );

  useEffect(() => {
    dispatch(
      fetchAllProducts({
        page: pagination.currentPage,
        limit: pagination.pageSize,
        category: productCategory === "ALL" ? undefined : productCategory,
      })
    );
  }, [dispatch, pagination.currentPage, pagination.pageSize, productCategory]);

  const columns = [
    { key: "title", header: "Title" },
    { key: "brand", header: "Brand" },
    { key: "category", header: "Category" },
    { key: "price", header: "Price" },
    { key: "rating", header: "Rating" },
    { key: "stock", header: "Stock" },
    { key: "description", header: "Description" },
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-[#322625]">Products</h1>
      <CategoryTabs />
      <ProductFilters />

      <DataTable<Product>
        columns={columns}
        data={data}
        totalItems={pagination.totalItems}
        currentPage={pagination.currentPage}
        pageSize={pagination.pageSize}
        searchQuery={searchQuery}
        onPageChange={(page) => dispatch(setCurrentPage(page))}
        onPageSizeChange={(size) => dispatch(setPageSize(size))}
      />
    </div>
  );
}
