"use client";
import DataTable from "@/components/common/DataTable";
import Filters from "@/components/common/Filters";
import PaginationComp from "@/components/common/Pagination";
import TableSkeleton from "@/components/common/TableSkeleton";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchAllUsers, fetchUsers } from "@/lib/store/users/slice";
import { Breadcrumbs, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, total, limit, page, allUsers, loading, error } =
    useAppSelector((state) => state.users);
  const [clientFilter, setClientFilter] = useState("");
  const [serverFilter, setServerFilter] = useState<{
    filter: string;
    value: string;
  } | null>(null);

  const prevServerFilter = useRef(serverFilter);
  const abortControllerRef = useRef<AbortController>(null);

  const usersColumns = [
    "image",
    "firstName",
    "lastName",
    "email",
    "phone",
    "username",
    "gender",
    "birthDate",
  ];

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchData = async () => {
      try {
        const queryParams = serverFilter?.value
          ? { [serverFilter.filter]: serverFilter.value }
          : {};

        const isServerFilterChange =
          prevServerFilter.current?.filter !== serverFilter?.filter ||
          prevServerFilter.current?.value !== serverFilter?.value;

        const newPage = isServerFilterChange ? 1 : page;
        prevServerFilter.current = serverFilter;

        await dispatch(
          fetchUsers({
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
  }, [dispatch, limit, page, serverFilter]);

  const handlePageSizeChange = (newLimit: number) => {
    const filters = serverFilter?.value
      ? { [serverFilter.filter]: serverFilter.value }
      : {};

    dispatch(fetchUsers({ limit: newLimit, page: 1, filters }));
  };

  const handlePageChange = (newPage: number) => {
    const filters = serverFilter?.value
      ? { [serverFilter.filter]: serverFilter.value }
      : {};

    dispatch(fetchUsers({ limit, page: newPage, filters }));
  };

  const formatBirthDate = (birthDate: string | null | undefined): string => {
    if (!birthDate) return "";

    const date = new Date(birthDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
  };

  const handleFilterChange = (filter: string, value: string) => {
    abortControllerRef.current?.abort();

    if (filter === "client") {
      setClientFilter(value);
      setServerFilter(null);
    } else {
      setServerFilter({
        filter,
        value: filter === "birthDate" ? formatBirthDate(value) : value,
      });
    }
  };

  const nameOptions = Array.from(new Set(allUsers.map((u) => u.firstName)));
  const emailOptions = Array.from(new Set(allUsers.map((u) => u.email)));

  return (
    <div className="sm:p-5 md:p-8 p-4 scrollbar-hide">
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/" className="hover:underline text-blueCustom">
          Home
        </Link>
        <Typography color="background">Users</Typography>
      </Breadcrumbs>
      <h1 className="mt-3 text-2xl font-bold mb-4">Users</h1>
      <Filters
        pageSize={limit}
        onPageSizeChange={handlePageSizeChange}
        onFilterChange={handleFilterChange}
        clientSideFilter={true}
        additionalFilters={[
          {
            key: "name",
            label: "Name",
            type: "dropdown",
            options: nameOptions,
          },
          {
            key: "email",
            label: "Email",
            type: "dropdown",
            options: emailOptions,
          },
          { key: "birthDate", label: "Birth Date", type: "date" },
          {
            key: "gender",
            label: "Gender",
            type: "dropdown",
            options: ["male", "female"],
          },
        ]}
      />
      {loading ? (
        <TableSkeleton columns={usersColumns} />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <DataTable
            data={users}
            columns={usersColumns}
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
