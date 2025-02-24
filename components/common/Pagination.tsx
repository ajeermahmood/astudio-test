import React from "react";
import { Pagination } from "@mui/material";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const PaginationComp: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  const pageCount = Math.ceil(totalItems / pageSize);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  return (
    <div className="flex justify-center mt-4">
      <Pagination
        count={pageCount}
        page={currentPage}
        onChange={handleChange}
        color="primary"
        aria-label="Table pagination"
      />
    </div>
  );
};

export default PaginationComp;
