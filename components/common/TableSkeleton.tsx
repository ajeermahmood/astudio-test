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

export default function TableSkeleton({ columns }: { columns: string[] }) {
  return (
    <TableContainer component={Paper} className="mb-4">
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col, index) => (
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
}


