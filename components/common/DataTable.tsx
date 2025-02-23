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

  return (
    <TableContainer component={Paper} className="mb-4">
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col} className="font-bold text-blackCustom">
                {col.toUpperCase()}
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
                      <Image
                        src={row[col]}
                        alt="User Image"
                        className="w-12 h-12 object-cover rounded"
                        width={48}
                        height={48}
                      />
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
