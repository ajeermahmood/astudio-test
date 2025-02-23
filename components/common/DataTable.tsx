import ErrorMessage from './ErrorMessage';
import { useEffect, useState } from 'react';
import PaginationControls from './PaginationControls';

interface DataTableProps<T> {
  columns: { key: string; header: string }[];
  data: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  searchQuery?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function DataTable<T>({
  columns,
  data,
  totalItems,
  currentPage,
  pageSize,
  searchQuery,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<T>) {
  const [filteredData, setFilteredData] = useState<T[]>([]);
  const totalPages = Math.ceil(totalItems / pageSize);

  useEffect(() => {
    if (searchQuery) {
      const filtered = data.filter(item =>
        columns.some(col => 
          String(item[col.key as keyof T]).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [data, searchQuery, columns]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#ebebeb]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#ebebeb]">
          <thead className="bg-[#fdc936]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-[#322625] uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#ebebeb]">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr 
                  key={index}
                  className="hover:bg-[#c0e3e5]/10 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-[#322625]"
                    >
                      {String(item[column.key as keyof T])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-8">
                  <ErrorMessage message="No data found" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}