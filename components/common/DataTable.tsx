import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
} from "@mui/material";
import Image from "next/image";

interface DataTableProps {
  data: any[];
  columns: string[];
  clientFilter?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  clientFilter = "",
}) => {
  const filteredData = clientFilter
    ? data.filter((item) =>
        columns.some((col) =>
          String(item[col]).toLowerCase().includes(clientFilter.toLowerCase())
        )
      )
    : data;

  const getTableTitles = (col: string) => {
    switch (col) {
      case "firstName":
        return "FIRST NAME";
      case "lastName":
        return "LAST NAME";
      case "birthDate":
        return "BIRTH DATE";
      default:
        return col.toUpperCase();
    }
  };

  return (
    <TableContainer
      component={Paper}
      className="mb-4 mt-7 scrollbar-hide"
    >
      <Table className="w-full">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col}
                className={`font-bold ${
                  col === "description" ? "min-w-[20rem]" : "min-w-[7rem]"
                }`}
              >
                {getTableTitles(col)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <TableRow key={index}>
                {columns.map((col) => (
                  <TableCell key={col}>
                    {col === "image" || col === "thumbnail" ? (
                      <div className="w-12 h-12 relative">
                        <Image
                          src={row[col]}
                          alt="Image"
                          fill
                          className="object-cover rounded"
                          sizes="48px"
                        />
                      </div>
                    ) : typeof row[col] === "object" ? (
                      JSON.stringify(row[col])
                    ) : (
                      row[col]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell height={300} colSpan={columns.length} align="center">
                No Data Available :/
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
