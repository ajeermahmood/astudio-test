"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchUsers } from "@/lib/store/users/slice";
import DataTable from "@/components/common/DataTable";
import Filters from "@/components/common/Filters";
import PaginationComp from "@/components/common/Pagination";
import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, total, limit, page, loading, error } = useAppSelector(
    (state) => state.users
  );
  const [clientFilter, setClientFilter] = useState("");
  const [serverFilter, setServerFilter] = useState<{
    filter: string;
    value: string;
  } | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    axios.get("https://dummyjson.com/users?limit=100").then((res) => {
      setAllUsers(res.data.users);
    });
  }, []);

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

  const renderSkeletonLoader = () => {
    return (
      <TableContainer component={Paper} className="mb-4">
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Image",
                "First Name",
                "Last Name",
                "Email",
                "Phone",
                "Username",
                "Gender",
                "Birth Date",
              ].map((col, index) => (
                <TableCell key={col} className="font-bold text-blackCustom">
                  {col.toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(6)].map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {[...Array(8)].map((_, cellIndex) => (
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
        renderSkeletonLoader()
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <DataTable
            data={users}
            columns={[
              "image",
              "firstName",
              "lastName",
              "email",
              "phone",
              "username",
              "gender",
              "birthDate",
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
