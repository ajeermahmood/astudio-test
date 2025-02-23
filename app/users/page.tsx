"use client";
import DataTable from "@/components/common/DataTable";
import Filters from "@/components/common/Filters";
import PaginationComp from "@/components/common/Pagination";
import TableSkeleton from "@/components/common/TableSkeleton";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchAllUsers, fetchUsers } from "@/lib/store/users/slice";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, total, limit, page, allUsers, loading, error } =
    useAppSelector((state) => state.users);
  const [clientFilter, setClientFilter] = useState("");
  const [serverFilter, setServerFilter] = useState<{
    filter: string;
    value: string;
  } | null>(null);

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
    if (serverFilter && serverFilter.value) {
      dispatch(
        fetchUsers({
          limit,
          page,
          filters: { [serverFilter.filter]: serverFilter.value },
        })
      );
    } else {
      dispatch(fetchUsers({ limit, page }));
    }
  }, [dispatch, limit, page, serverFilter]);

  const handlePageSizeChange = (newLimit: number) => {
    dispatch(
      fetchUsers({
        limit: newLimit,
        page: 1,
        filters:
          serverFilter && serverFilter.value
            ? { [serverFilter.filter]: serverFilter.value }
            : {},
      })
    );
  };

  const handlePageChange = (newPage: number) => {
    dispatch(
      fetchUsers({
        limit,
        page: newPage,
        filters:
          serverFilter && serverFilter.value
            ? { [serverFilter.filter]: serverFilter.value }
            : {},
      })
    );
  };

  const handleFilterChange = (filter: string, value: string) => {
    if (filter === "client") {
      setClientFilter(value);
      setServerFilter(null);
    } else {
      setServerFilter({ filter, value });
      dispatch(fetchUsers({ limit, page: 1, filters: { [filter]: value } }));
    }
  };

  const nameOptions = Array.from(new Set(allUsers.map((u) => u.firstName)));
  const emailOptions = Array.from(new Set(allUsers.map((u) => u.email)));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blackCustom mb-4">Users</h1>
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
