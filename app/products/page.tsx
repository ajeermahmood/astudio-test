"use client";
import DataTable from "@/components/common/DataTable";
import Filters, { AdditionalFilter } from "@/components/common/Filters";
import PaginationComp from "@/components/common/Pagination";
import TableSkeleton from "@/components/common/TableSkeleton";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchAllCategories,
  fetchAllProducts,
  fetchProducts,
} from "@/lib/store/products/slice";
import { Breadcrumbs, Tab, Tabs, Typography } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const {
    products,
    total,
    limit,
    page,
    allProducts,
    allCategories,
    loading,
    error,
  } = useAppSelector((state) => state.products);
  const [currentTab, setCurrentTab] = useState("ALL");
  const [clientFilter, setClientFilter] = useState("");
  const [serverFilter, setServerFilter] = useState<{
    filter: string;
    value: string;
  } | null>(null);

  const prevServerFilter = useRef(serverFilter);
  const prevCurrentTab = useRef(currentTab);

  const productsColumns = [
    "thumbnail",
    "title",
    "brand",
    "category",
    "description",
    "price",
    "rating",
    "stock",
  ];

  const abortControllerRef = useRef<AbortController>(undefined);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchData = async () => {
      try {
        let queryParams: { [key: string]: string } = {};
        if (currentTab === "Laptops") {
          queryParams.category = "laptops";
        }

        if (serverFilter?.value && currentTab === "ALL") {
          queryParams[serverFilter.filter] = serverFilter.value;
        }

        const isServerFilterChange =
          prevServerFilter.current?.filter !== serverFilter?.filter ||
          prevServerFilter.current?.value !== serverFilter?.value;
        const isCurrentTabChange = prevCurrentTab.current !== currentTab;

        const newPage = isServerFilterChange || isCurrentTabChange ? 1 : page;

        prevServerFilter.current = serverFilter;
        prevCurrentTab.current = currentTab;

        await dispatch(
          fetchProducts({
            limit,
            page: newPage,
            filters: queryParams,
            signal: controller.signal,
          })
        ).unwrap();
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [dispatch, limit, page, currentTab, serverFilter]);

  const handlePageSizeChange = (newLimit: number) => {
    let filters = currentTab === "Laptops" ? { category: "laptops" } : {};
    if (serverFilter && serverFilter.value) {
      filters = { ...filters, [serverFilter.filter]: serverFilter.value };
    }
    dispatch(fetchProducts({ limit: newLimit, page: 1, filters }));
  };

  const handlePageChange = (newPage: number) => {
    let filters = currentTab === "Laptops" ? { category: "laptops" } : {};
    if (serverFilter && serverFilter.value) {
      filters = { ...filters, [serverFilter.filter]: serverFilter.value };
    }
    dispatch(fetchProducts({ limit, page: newPage, filters }));
  };

  const handleFilterChange = (filter: string, value: string, btn?: boolean) => {
    abortControllerRef.current?.abort();

    if (filter === "client") {
      setClientFilter(value);
      if (btn) {
        setServerFilter(null);
      }
    } else {
      if (currentTab !== "ALL") {
        setClientFilter(value);
        return;
      }
      setServerFilter({ filter, value });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    abortControllerRef.current?.abort();
    setCurrentTab(newValue);
    setServerFilter(null);
    setClientFilter("");
  };

  const titleOptions = Array.from(
    new Set(
      allProducts
        .filter((p) =>
          currentTab === "Laptops" ? p.category === "laptops" : true
        )
        .map((p) => p.title)
    )
  );
  const brandOptions = Array.from(
    new Set(
      allProducts
        .filter((p) =>
          currentTab === "Laptops" ? p.category === "laptops" : true
        )
        .map((p) => p.brand)
    )
  );
  const additionalFilters: AdditionalFilter[] = [
    { key: "title", label: "Title", type: "dropdown", options: titleOptions },
    { key: "brand", label: "Brand", type: "dropdown", options: brandOptions },
  ];

  if (currentTab === "ALL") {
    additionalFilters.push({
      key: "category",
      label: "Category",
      type: "dropdown",
      options: allCategories,
    });
  }

  return (
    <div className="sm:p-5 md:p-8 p-4 scrollbar-hide">
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/" className="hover:underline text-blueCustom">
          Home
        </Link>
        <Typography color="background">Products</Typography>
      </Breadcrumbs>
      <h1 className="mt-3 text-2xl font-bold mb-4">Products</h1>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        className="mb-6"
      >
        <Tab value="ALL" label="ALL" />
        <Tab value="Laptops" label="Laptops" />
      </Tabs>
      <Filters
        pageSize={limit}
        onPageSizeChange={handlePageSizeChange}
        onFilterChange={handleFilterChange}
        clientSideFilter={true}
        additionalFilters={additionalFilters}
        currentTab={currentTab}
      />
      {loading ? (
        <TableSkeleton columns={productsColumns} />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <DataTable
            data={products}
            columns={productsColumns}
            clientFilter={clientFilter}
          />
          <PaginationComp
            currentPage={page}
            totalItems={total}
            pageSize={limit}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
