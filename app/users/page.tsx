'use client';
import DataTable from "@/components/common/DataTable";
import UserFilters from "@/components/users/UserFilters";
import { User } from "@/lib/types";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { fetchAllUsers, setCurrentPage, setPageSize } from "@/lib/store/users/slice";
import { useEffect } from "react";
import LoadingOverlay from "@/components/common/LoadingOverlay";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { data, status, pagination, error } = useAppSelector(
    (state) => state.users
  );
  const { searchQuery } = useAppSelector((state) => state.filters);

  useEffect(() => {
    dispatch(
      fetchAllUsers({
        page: pagination.currentPage,
        limit: pagination.pageSize,
        search: searchQuery,
      })
    );
  }, [dispatch, pagination.currentPage, pagination.pageSize, searchQuery]);

  const columns = [
    { key: "firstName", header: "First Name" },
    { key: "lastName", header: "Last Name" },
    { key: "email", header: "Email" },
    { key: "age", header: "Age" },
    { key: "gender", header: "Gender" },
    { key: "username", header: "Username" },
    { key: "birthDate", header: "Birth Date" },
    { key: "bloodGroup", header: "Blood Group" },
    { key: "eyeColor", header: "Eye Color" },
  ];

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-6 space-y-4 relative">
      <h1 className="text-3xl font-bold text-[#322625]">Users</h1>
      <UserFilters />
      <LoadingOverlay visible={status === "loading"} />

      <DataTable<User>
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
