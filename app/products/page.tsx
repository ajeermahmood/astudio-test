"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchProducts } from "@/lib/store/products/slice";
import DataTable from "@/components/common/DataTable";
import Filters, { AdditionalFilter } from "@/components/common/Filters";
import PaginationComp from "@/components/common/Pagination";
import {
  Tabs,
  Tab,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, total, limit, page, loading, error } = useAppSelector(
    (state) => state.products
  );
  const [currentTab, setCurrentTab] = useState("ALL");
  const [clientFilter, setClientFilter] = useState("");
  const [serverFilter, setServerFilter] = useState<{
    filter: string;
    value: string;
  } | null>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);

  const abortControllerRef = useRef<AbortController>(undefined);
  const isMounted = useRef(true);

  // Add cleanup for component unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  // Fetch all products to populate filter options
  useEffect(() => {
    axios.get("https://dummyjson.com/products?limit=100").then((res) => {
      setAllProducts(res.data.products);
    });

    axios.get("https://dummyjson.com/products/category-list").then((res) => {
      setAllCategories(res.data);
    });
  }, []);

  // Fetch products whenever limit, page, currentTab, or serverFilter changes
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

        await dispatch(
          fetchProducts({
            limit,
            page,
            filters: queryParams,
            signal: controller.signal
          })
        ).unwrap();

        if (isMounted.current) {
          // Force update of filter options after successful fetch
          setAllProducts(prev => [...prev]); // Trigger re-render
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Fetch error:", error);
        }
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

  const handleFilterChange = (filter: string, value: string) => {
    abortControllerRef.current?.abort(); // Cancel previous requests
    
    if (filter === "client") {
      setClientFilter(value);
      setServerFilter(null);
    } else {
      if (currentTab !== "ALL") {
        setClientFilter(value);
        return;
      }
      setServerFilter({ filter, value });
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    abortControllerRef.current?.abort(); // Cancel pending requests
    setCurrentTab(newValue);
    setServerFilter(null);
    setClientFilter("");
  };

  // Build additional filter options from allProducts data
  const titleOptions = Array.from(
    new Set(
      allProducts
        .filter((p) => {
          if (currentTab === "Laptops") {
            return p.category === "laptops";
          } else {
            return true;
          }
        })
        .map((p) => p.title)
    )
  );
  const brandOptions = Array.from(
    new Set(
      allProducts
        .filter((p) => {
          if (currentTab === "Laptops") {
            return p.category === "laptops";
          } else {
            return true;
          }
        })
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

  const renderSkeletonLoader = () => {
    return (
      <TableContainer component={Paper} className="mb-4">
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Thumbnail",
                "Title",
                "Brand",
                "Category",
                "Description",
                "Price",
                "Rating",
                "Stock",
              ].map((col) => (
                <TableCell key={col} className="font-bold text-blackCustom">
                  {col.toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(6)].map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {[...Array(9)].map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton variant="rectangular" width="100%" height={40} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blackCustom mb-4">Products</h1>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        className="mb-4"
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
        renderSkeletonLoader()
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <DataTable
            data={products}
            columns={[
              "thumbnail",
              "title",
              "brand",
              "category",
              "description",
              "price",
              "rating",
              "stock",
            ]}
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
